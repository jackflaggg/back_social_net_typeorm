import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../../infrastructure/user.repository';
import { randomUUID } from 'node:crypto';

export class LoginUserCommand {
    constructor(
        public readonly loginOrEmail: string,
        private readonly password: string,
        private readonly ip: string,
        private readonly userAgent: string,
    ) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserUseCase implements ICommandHandler<LoginUserCommand> {
    constructor(private readonly userRepository: UserRepository) {}
    async execute(command: LoginUserCommand) {
        return randomUUID();
    }
}
