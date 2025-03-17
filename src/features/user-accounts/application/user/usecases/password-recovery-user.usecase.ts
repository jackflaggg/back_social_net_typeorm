import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { EmailService } from '../../../../notifications/application/mail.service';
import { randomUUID } from 'node:crypto';
import { add } from 'date-fns/add';
import { emailConfirmationData, emailConfirmationDataAdmin } from '../../../../../core/utils/user/email-confirmation-data.admin';
import { UserPgRepository } from '../../../infrastructure/postgres/user/user.pg.repository';
import { PasswordRecoveryPgRepository } from '../../../infrastructure/postgres/password/password.pg.recovery.repository';
import { BcryptService } from '../../other_services/bcrypt.service';
import { UserRepositoryOrm } from '../../../infrastructure/typeorm/user/user.orm.repo';
import { PasswordRecoveryRepositoryOrm } from '../../../infrastructure/typeorm/password/password.orm.recovery.repository';
import { User } from '../../../domain/typeorm/user/user.entity';

export class PasswordRecoveryUserCommand {
    constructor(public readonly email: string) {}
}

@CommandHandler(PasswordRecoveryUserCommand)
export class PasswordRecoveryUserUseCase implements ICommandHandler<PasswordRecoveryUserCommand> {
    constructor(
        @Inject() private readonly usersRepository: UserRepositoryOrm,
        @Inject() private readonly passwordRepository: PasswordRecoveryRepositoryOrm,
        private readonly bcryptService: BcryptService,
        private readonly mailer: EmailService,
    ) {}
    async execute(command: PasswordRecoveryUserCommand) {
        const findUser = await this.usersRepository.findUserByLoginOrEmail(command.email);

        if (!findUser) {
            // если пользователя не существует, то мы его по тихому регаем!
            const login = command.email.substring(0, command.email.indexOf('@'));

            const newPasswordHash = await this.bcryptService.hashPassword('');

            const emailConfirmationData = emailConfirmationDataAdmin();

            const userDto = {
                login: login,
                email: command.email,
                password: newPasswordHash,
                sentEmailRegistration: true,
                emailConfirmation: {
                    confirmationCode: emailConfirmationData.emailConfirmation.confirmationCode,
                    expirationDate: emailConfirmationData.emailConfirmation.expirationDate,
                    isConfirmed: emailConfirmationData.emailConfirmation.isConfirmed,
                },
            };

            const newUser = User.buildInstance(userDto);
            const userId = await this.usersRepository.save(newUser);

            const confirmationCode = randomUUID();

            const codeExpirationDate = add(new Date(), { hours: 1, minutes: 30 });

            // await this.passwordRepository.createPasswordRecovery(String(userId), confirmationCode, codeExpirationDate);

            this.mailer.sendPasswordRecoveryMessage(command.email, newUser.emailConfirmation.confirmationCode).catch((err: unknown) => {
                console.log(String(err));
            });
        } else {
            // если существует, то обновляем ему emailConf в юзербд + создаем запись в пассвордбд
            const generateCode = randomUUID();

            const newExpirationDate = add(new Date(), {
                hours: 1,
                minutes: 30,
            });

            const newIsConfirmed = false;

            findUser.updateUserToCodeAndDate(generateCode, newExpirationDate, newIsConfirmed);
            await this.usersRepository.save(findUser);

            // await this.passwordRepository.createPasswordRecovery(findUser.id, generateCode, newExpirationDate);

            this.mailer.sendPasswordRecoveryMessage(command.email, findUser.confirmationCode).catch((err: unknown) => {
                console.log(String(err));
            });
        }
    }
}
