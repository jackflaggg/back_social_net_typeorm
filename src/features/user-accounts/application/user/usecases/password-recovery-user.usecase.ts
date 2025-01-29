import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UserRepository } from '../../../infrastructure/user/user.repository';
import { PasswordRecoveryDbRepository } from '../../../infrastructure/password/password.recovery.repository';
import { EmailService } from '../../../../notifications/application/mail.service';
import { randomUUID } from 'node:crypto';
import { UserEntity } from '../../../domain/user/user.entity';

export class PasswordRecoveryUserCommand {
    constructor(public readonly email: string) {}
}

@CommandHandler(PasswordRecoveryUserCommand)
export class PasswordRecoveryUserUseCase implements ICommandHandler<PasswordRecoveryUserCommand> {
    constructor(
        @Inject() private readonly usersRepository: UserRepository,
        @Inject() private readonly passwordRepository: PasswordRecoveryDbRepository,
        private readonly mailer: EmailService,
    ) {}
    async execute(command: PasswordRecoveryUserCommand) {
        const findUser = await this.usersRepository.findUserByLoginOrEmail(command.email);

        if (!findUser) {
            // если пользователя не существует, то мы его регаем!
            const login = command.email.substring(0, command.email.indexOf('@'));

            const user = new UserEntity(login, command.email);

            await user.setPassword('', 0);

            const mappingUser = user.mappingUserCreateClient();

            const newUser = await this.usersRepository.createUser(mappingUser);

            await this.passwordRepository.createCodeAndDateConfirmation(
                newUser,
                String(newUser.emailConfirmation!.confirmationCode),
                newUser.emailConfirmation!.expirationDate,
            );

            this.mailer.sendPasswordRecoveryMessage(command.email, mappingUser.emailConfirmation.confirmationCode).catch((err: unknown) => {
                console.log(String(err));
            });
        } else {
            // если существует, то обновляем ему emailConf в юзербд + создаем запись в пассвордбд
            const generateCode = randomUUID();

            const newExpirationDate = add(new Date(), {
                hours: 1,
                minutes: 30,
            });

            await this.usersRepository.updateUserToCodeAndDate(new ObjectId(findUser.id), generateCode, newExpirationDate);

            await this.passwordRepository.createCodeAndDateConfirmation(new ObjectId(findUser.id), generateCode, newExpirationDate);

            this.mailer.sendPasswordRecoveryMessage(command.email, mappingUser.emailConfirmation.confirmationCode).catch((err: unknown) => {
                console.log(String(err));
            });
        }
    }
}
