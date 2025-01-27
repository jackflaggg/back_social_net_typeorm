import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'node:crypto';
import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export class LoginUserCommand {
    constructor(
        private readonly password: string,
        private readonly ip: string = '255.255.255.0',
        private readonly userAgent: string = 'google',
        private readonly user: any,
    ) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserUseCase implements ICommandHandler<LoginUserCommand> {
    constructor(
        @Inject() private readonly jwtService: JwtService,
        private readonly commandBus: CommandBus,
    ) {}
    async execute(command: LoginUserCommand) {
        console.log(command);
        return randomUUID();
    }
}
