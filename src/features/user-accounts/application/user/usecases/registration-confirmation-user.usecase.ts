import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UserRepository } from '../../../infrastructure/user/user.repository';
import { PasswordRecoveryDbRepository } from '../../../infrastructure/password/password.recovery.repository';
import { BadRequestDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';

export class RegistrationConfirmationUserCommand {
    constructor(public readonly code: string) {}
}

@CommandHandler(RegistrationConfirmationUserCommand)
export class RegistrationConfirmationUserUseCase implements ICommandHandler<RegistrationConfirmationUserCommand> {
    constructor(
        @Inject() private readonly usersRepository: UserRepository,
        @Inject() private readonly passwordRepository: PasswordRecoveryDbRepository,
    ) {}
    async execute(command: RegistrationConfirmationUserCommand) {
        const recCode = await this.passwordRepository.findRecoveryCodeUser(command.code);
        if (recCode) {
            throw BadRequestDomainException.create('этот код предназначен для new-password', 'RegistrationConfirmationUserUseCase');
        }
        const findCode = await this.usersRepository.findUserCode(command.code);

        // поиск юзера
        if (!findCode || (findCode.emailConfirmation && command.code !== findCode.emailConfirmation.confirmationCode)) {
            throw BadRequestDomainException.create('юзер не найден', 'code');
        }

        // проверка на истекание кода
        if (findCode.emailConfirmation!.expirationDate !== null && !findCode.emailConfirmation!.isConfirmed) {
            const currentDate = new Date();
            const expirationDate = new Date(findCode.emailConfirmation!.expirationDate as Date);

            if (expirationDate < currentDate) {
                throw BadRequestDomainException.create('код протух, переобновись!', 'RegistrationConfirmationUserUseCase');
            }
        }

        // проверка на подтверждение регистрации
        if (findCode.emailConfirmation!.isConfirmed && findCode.emailConfirmation!.confirmationCode === '+') {
            throw BadRequestDomainException.create('подтверждение уже было!', 'RegistrationConfirmationUserUseCase');
        }

        return await this.usersRepository.updateUserToEmailConf(findCode.id);
    }
}
