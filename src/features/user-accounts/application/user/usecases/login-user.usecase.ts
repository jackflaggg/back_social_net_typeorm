import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../../infrastructure/user.repository';
import { randomUUID } from 'node:crypto';
import { UserDocument, UserModelType } from '../../../domain/user/user.entity';

export class LoginUserCommand {
    constructor(
        public readonly loginOrEmail: string,
        private readonly password: string,
        private readonly ip: string = '255.255.255.0',
        private readonly userAgent: string = 'google',
        private readonly user: any,
    ) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserUseCase implements ICommandHandler<LoginUserCommand> {
    constructor(private readonly userRepository: UserRepository) {}
    async execute(command: LoginUserCommand) {
        console.log(command);
        return randomUUID();
    }
}
