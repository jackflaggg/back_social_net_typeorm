import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { EmailService } from '../../../../notifications/application/mail.service';
import { randomUUID } from 'node:crypto';
import { add } from 'date-fns/add';
import { BcryptService } from '../../other_services/bcrypt.service';
import { UserRepositoryOrm } from '../../../infrastructure/typeorm/user/user.orm.repo';
import { User } from '../../../domain/typeorm/user/user.entity';
import { EmailConfirmationToUser } from '../../../domain/typeorm/email-confirmation/email.confirmation.entity';
import { RecoveryPasswordToUser } from '../../../domain/typeorm/password-recovery/pass-rec.entity';
import { BadRequestDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';

export class PasswordRecoveryUserCommand {
    constructor(public readonly email: string) {}
}

@CommandHandler(PasswordRecoveryUserCommand)
export class PasswordRecoveryUserUseCase implements ICommandHandler<PasswordRecoveryUserCommand> {
    constructor(
        @Inject() private readonly usersRepository: UserRepositoryOrm,
        private readonly bcryptService: BcryptService,
        private readonly mailer: EmailService,
    ) {}
    async execute(command: PasswordRecoveryUserCommand) {
        const findUser = await this.usersRepository.findUserByEmail(command.email);

        if (!findUser) {
            // если пользователя не существует, то мы его по тихому регаем!
            const login = command.email.substring(0, command.email.indexOf('@'));

            const newPasswordHash = await this.bcryptService.hashPassword('');

            const userDto = {
                login: login,
                email: command.email,
                password: newPasswordHash,
                sentEmailRegistration: true,
            };

            // создаю юзера
            const newUser = User.buildInstance(userDto);

            const userId = await this.usersRepository.save(newUser);

            // создаю запись в emailConfirmation!
            const confirmationCode = randomUUID();

            const codeExpirationDate = add(new Date(), { hours: 1, minutes: 30 });

            const emailConfirmationUserDto = {
                confirmationCode,
                expirationDate: codeExpirationDate,
                isConfirmed: false,
            };

            const newEmailConfirmationUser = EmailConfirmationToUser.buildInstance(emailConfirmationUserDto, userId);

            await this.usersRepository.saveEmailConfirmation(newEmailConfirmationUser);

            const recoveryCode = randomUUID();

            const recoveryPasswordDto = {
                recoveryCode,
                recoveryExpirationDate: codeExpirationDate,
            };

            const newRecoveryPassword = RecoveryPasswordToUser.buildInstance(recoveryPasswordDto, userId);

            this.mailer
                .sendPasswordRecoveryMessage(command.email, newRecoveryPassword.recoveryCode)
                .then(() => {
                    this.usersRepository.saveRecoveryPassword(newRecoveryPassword);
                })
                .catch((err: unknown) => {
                    console.log(String(err));
                });
        }

        const recoveryCode = randomUUID();

        const codeExpirationDate = add(new Date(), { hours: 1, minutes: 30 });

        const recoveryPasswordDto = {
            recoveryCode,
            recoveryExpirationDate: codeExpirationDate,
        };

        if (!findUser) throw BadRequestDomainException.create('произошла критическая ошибка!', 'user');

        const newRecoveryPassword = RecoveryPasswordToUser.buildInstance(recoveryPasswordDto, findUser.id);

        this.mailer
            .sendPasswordRecoveryMessage(command.email, newRecoveryPassword.recoveryCode)
            .then(() => {
                this.usersRepository.saveRecoveryPassword(newRecoveryPassword);
            })
            .catch((err: unknown) => {
                console.log(String(err));
            });
    }
}
