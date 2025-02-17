import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { EmailService } from '../../../../notifications/application/mail.service';
import { randomUUID } from 'node:crypto';
import { UserEntity, UserModelType } from '../../../domain/user/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { add } from 'date-fns/add';
import { emailConfirmationData } from '../../../../../core/utils/user/email-confirmation-data.admin';
import { PasswordRecoveryDbRepository } from '../../../infrastructure/mongoose/password/password.recovery.repository';
import { UserRepository } from '../../../infrastructure/mongoose/user/user.repository';

export class PasswordRecoveryUserCommand {
    constructor(public readonly email: string) {}
}

@CommandHandler(PasswordRecoveryUserCommand)
export class PasswordRecoveryUserUseCase implements ICommandHandler<PasswordRecoveryUserCommand> {
    constructor(
        @Inject() private readonly usersRepository: UserRepository,
        @Inject() private readonly passwordRepository: PasswordRecoveryDbRepository,
        @InjectModel(UserEntity.name) private readonly userModel: UserModelType,
        private readonly mailer: EmailService,
    ) {}
    async execute(command: PasswordRecoveryUserCommand) {
        const findUser = await this.usersRepository.findUserByLoginOrEmail(command.email);

        if (!findUser) {
            // если пользователя не существует, то мы его по тихому регаем!
            const login = command.email.substring(0, command.email.indexOf('@'));

            const user = this.userModel.buildInstance({
                login,
                email: command.email,
                password: '',
                ...emailConfirmationData(),
            });

            await user.setPasswordAdmin('');

            await this.usersRepository.save(user);

            await this.passwordRepository.createCodeAndDateConfirmation(
                user._id.toString(),
                String(user.emailConfirmation!.confirmationCode),
                user.emailConfirmation!.expirationDate,
            );

            this.mailer.sendPasswordRecoveryMessage(command.email, user.emailConfirmation.confirmationCode).catch((err: unknown) => {
                console.log(String(err));
            });
        } else {
            // если существует, то обновляем ему emailConf в юзербд + создаем запись в пассвордбд
            const generateCode = randomUUID();

            const newExpirationDate = add(new Date(), {
                hours: 1,
                minutes: 30,
            });

            await this.usersRepository.updateUserToCodeAndDate(findUser.id, generateCode, newExpirationDate);

            await this.passwordRepository.createCodeAndDateConfirmation(findUser.id, generateCode, newExpirationDate);

            this.mailer.sendPasswordRecoveryMessage(command.email, findUser.emailConfirmation.confirmationCode).catch((err: unknown) => {
                console.log(String(err));
            });
        }
    }
}
