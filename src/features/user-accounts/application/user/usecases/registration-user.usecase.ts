import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { EmailService } from '../../../../notifications/application/mail.service';
import { CommonCreateUserCommand } from './common-create-user.usecase';
import { UserRepository } from '../../../infrastructure/mongoose/user/user.repository';
import { UserPgRepository } from '../../../infrastructure/postgres/user/user.pg.repository';

export class RegistrationUserCommand {
    constructor(public readonly payload: any) {}
}

@CommandHandler(RegistrationUserCommand)
export class RegistrationUserUseCase implements ICommandHandler<RegistrationUserCommand> {
    constructor(
        @Inject() private readonly usersRepository: UserPgRepository,
        private readonly commandBus: CommandBus,
        private readonly mailer: EmailService,
    ) {}
    async execute(command: RegistrationUserCommand) {
        const userId = await this.commandBus.execute<CommonCreateUserCommand, string>(new CommonCreateUserCommand(command.payload));
        const user = await this.usersRepository.findUserById(userId);

        // this.mailer.sendEmailRecoveryMessage(command.payload.email, user.emailConfirmation.confirmationCode).catch((err: unknown) => {
        //     console.log(err);
        // });
    }
}
