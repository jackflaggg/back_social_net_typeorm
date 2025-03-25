import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { UserRepositoryOrm } from '../../../infrastructure/typeorm/user/user.orm.repo';
import { PasswordRecoveryRepositoryOrm } from '../../../infrastructure/typeorm/password/password.orm.recovery.repository';
import { EmailConfirmationToUser } from '../../../domain/typeorm/email-confirmation/email.confirmation.entity';
import { EmailConfirmationRepositoryOrm } from '../../../infrastructure/typeorm/email-conf/email.orm.conf.repository';

export class RegistrationConfirmationUserCommand {
    constructor(public readonly code: string) {}
}

@CommandHandler(RegistrationConfirmationUserCommand)
export class RegistrationConfirmationUserUseCase implements ICommandHandler<RegistrationConfirmationUserCommand> {
    constructor(
        private readonly usersRepository: UserRepositoryOrm,
        private readonly emailConfirmationRepository: EmailConfirmationRepositoryOrm,
        private readonly passwordRepository: PasswordRecoveryRepositoryOrm,
    ) {}
    async execute(command: RegistrationConfirmationUserCommand) {
        // 1. если я нашел код в другой табличке, значит, ошибка!
        const recCode = await this.passwordRepository.findCode(command.code);

        if (recCode) {
            throw BadRequestDomainException.create('этот код предназначен для new-password', 'RegistrationConfirmationUserUseCase');
        }
        // 2. ищу код в email_confirmation
        const findCode = await this.emailConfirmationRepository.findCodeToEmailRegistration(command.code);

        // P.S. Специфичная обработка ошибки для тестов!
        if (!findCode || command.code !== findCode.confirmationCode || !(findCode instanceof EmailConfirmationToUser)) {
            throw BadRequestDomainException.create('код не найден', 'code');
        }

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
        const confirmationCode = '+';

        const isConfirmed = true;

        await this.emailConfirmationRepository.updateCodeAndIsConfirmed(confirmationCode, isConfirmed, findCode);
    }
}
