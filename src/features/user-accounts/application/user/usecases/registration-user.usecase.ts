import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UserRepository } from '../../../infrastructure/user/user.repository';

export class RegistrationUserCommand {
    constructor(public readonly dto: any) {}
}

@CommandHandler(RegistrationUserCommand)
export class RegistrationUserUseCase implements ICommandHandler<RegistrationUserCommand> {
    constructor(
        @Inject() private readonly usersRepository: UserRepository,
        private readonly commandBus: CommandBus,
    ) {}
    async execute(command: RegistrationUserCommand) {}
}
