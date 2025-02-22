import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { BadRequestDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { UserPgRepository } from '../../../infrastructure/postgres/user/user.pg.repository';
import { PasswordRecoveryPgRepository } from '../../../infrastructure/postgres/password/password.pg.recovery.repository';

export class RegistrationConfirmationUserCommand {
    constructor(public readonly code: string) {}
}

@CommandHandler(RegistrationConfirmationUserCommand)
export class RegistrationConfirmationUserUseCase implements ICommandHandler<RegistrationConfirmationUserCommand> {
    constructor(
        @Inject() private readonly usersRepository: UserPgRepository,
        @Inject() private readonly passwordRepository: PasswordRecoveryPgRepository,
    ) {}
    async execute(command: RegistrationConfirmationUserCommand) {
        // 1. если я нашел код в другой табличке, значит, ошибка!
        const recCode = await this.passwordRepository.findCode(command.code);

        if (recCode) {
            throw BadRequestDomainException.create('этот код предназначен для new-password', 'RegistrationConfirmationUserUseCase');
        }
        // 2. ищу код в email_confirmation
        const findCode = await this.usersRepository.findUserCode(command.code);

        // 3. проверка на истекание кода
        if (findCode.expirationDate !== null && !findCode.isConfirmed) {
            const currentDate = new Date();
            const expirationDate = new Date(findCode.expirationDate as Date);

            if (expirationDate < currentDate) {
                throw BadRequestDomainException.create('код протух, переобновись!', 'RegistrationConfirmationUserUseCase');
            }
        }

        // 4. проверка на подтверждение регистрации
        if (findCode.isConfirmed && findCode.confirmationCode === '+') {
            throw BadRequestDomainException.create('подтверждение уже было!', 'RegistrationConfirmationUserUseCase');
        }

        // 5. обновляю
        return await this.usersRepository.updateUserToEmailConf(findCode.userId);
    }
}
