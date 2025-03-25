import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { EmailService } from '../../../../notifications/application/mail.service';
import { CommonCreateUserCommand } from './common-create-user.usecase';
import { AuthRegistrationDtoApi } from '../../../dto/api/auth.registration.dto';
import { BadRequestDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { UserRepositoryOrm } from '../../../infrastructure/typeorm/user/user.orm.repo';
import { User } from '../../../domain/typeorm/user/user.entity';

export class RegistrationUserCommand {
    constructor(public readonly payload: AuthRegistrationDtoApi) {}
}

@CommandHandler(RegistrationUserCommand)
export class RegistrationUserUseCase implements ICommandHandler<RegistrationUserCommand> {
    constructor(
        @Inject() private readonly userRepository: UserRepositoryOrm,
        private readonly commandBus: CommandBus,
        private readonly mailer: EmailService,
    ) {}
    async execute(command: RegistrationUserCommand): Promise<void> {
        // проверяю существует ли юзер, даже если он удален!
        const existingUser = await this.userRepository.findCheckExistUserEntity(command.payload.login, command.payload.email);

        if (existingUser) {
            throw BadRequestDomainException.create(
                'такой юзер уже существует!',
                existingUser.login === command.payload.login ? 'login' : 'email',
            );
        }

        // создаю юзера
        const emailConfirmation = await this.commandBus.execute<CommonCreateUserCommand, { userId: number; confirmationCode: string }>(
            new CommonCreateUserCommand(command.payload),
        );

        const user: User = await this.userRepository.findUserById(String(emailConfirmation.userId));

        this.mailer
            .sendEmailRecoveryMessage(command.payload.email, emailConfirmation.confirmationCode)
            .then(() => {
                this.userRepository.updateUserConfirmedSendEmail(user);
            })
            .catch((err: unknown) => {
                console.log(err);
            });
    }
}
