import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { EmailService } from '../../../../notifications/application/mail.service';
import { randomUUID } from 'node:crypto';
import { add } from 'date-fns/add';
import { BcryptService } from '../../other_services/bcrypt.service';
import { UserRepositoryOrm } from '../../../infrastructure/typeorm/user/user.orm.repo';
import { RecoveryPasswordToUser } from '../../../domain/typeorm/password-recovery/pass-rec.entity';
import { BadRequestDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { PasswordRecoveryRepositoryOrm } from '../../../infrastructure/typeorm/password/password.orm.recovery.repository';

export class PasswordRecoveryUserCommand {
    constructor(public readonly email: string) {}
}

@CommandHandler(PasswordRecoveryUserCommand)
export class PasswordRecoveryUserUseCase implements ICommandHandler<PasswordRecoveryUserCommand> {
    constructor(
        @Inject() private readonly usersRepository: UserRepositoryOrm,
        @Inject() private readonly recPassRepository: PasswordRecoveryRepositoryOrm,
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
            const userId = await this.usersRepository.createUser(userDto);

            // создаю запись в emailConfirmation!
            const confirmationCode = randomUUID();

            const codeExpirationDate = add(new Date(), { hours: 1, minutes: 30 });

            const emailConfirmationUserDto = {
                confirmationCode,
                expirationDate: codeExpirationDate,
                isConfirmed: false,
            };

            await this.usersRepository.createEmailConfirmationToUser(emailConfirmationUserDto, userId);

            const recoveryCode = randomUUID();

            const recoveryPasswordDto = {
                recoveryCode,
                recoveryExpirationDate: codeExpirationDate,
            };

            const newRecoveryPassword = RecoveryPasswordToUser.buildInstance(recoveryPasswordDto, userId);

            this.mailer
                .sendPasswordRecoveryMessage(command.email, newRecoveryPassword.recoveryCode)
                .then(() => {
                    this.recPassRepository.saveRecoveryPassword(newRecoveryPassword);
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
                this.recPassRepository.saveRecoveryPassword(newRecoveryPassword);
            })
            .catch((err: unknown) => {
                console.log(String(err));
            });
    }
}
