import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UserRepository } from '../../../infrastructure/user/user.repository';
import { EmailService } from '../../../../notifications/application/mail.service';
import { NotFoundDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { CommonCreateUserCommand } from './common-create-user.usecase';

export class RegistrationUserCommand {
    constructor(public readonly payload: any) {}
}

@CommandHandler(RegistrationUserCommand)
export class RegistrationUserUseCase implements ICommandHandler<RegistrationUserCommand> {
    constructor(
        @Inject() private readonly usersRepository: UserRepository,
        private readonly commandBus: CommandBus,
        private readonly mailer: EmailService,
    ) {}
    async execute(command: RegistrationUserCommand) {
        const userId = await this.commandBus.execute<CommonCreateUserCommand, string>(new CommonCreateUserCommand(command.payload));
        const user = await this.usersRepository.findUserByIdOrFail(userId);

        if (!user) {
            throw NotFoundDomainException.create();
        }
        this.mailer.sendEmailRecoveryMessage(command.payload.email, user.emailConfirmation.confirmationCode).catch((err: unknown) => {
            console.log(err);
        });
    }
}
