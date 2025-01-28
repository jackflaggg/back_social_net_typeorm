import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'node:crypto';
import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateSessionCommand } from '../../device/usecases/create-session.usecase';

export class LoginUserCommand {
    constructor(
        public readonly ip: string = '255.255.255.0',
        public readonly userAgent: string = 'google',
        public readonly user: any,
    ) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserUseCase implements ICommandHandler<LoginUserCommand> {
    constructor(
        @Inject() private readonly jwtService: JwtService,
        private readonly commandBus: CommandBus,
    ) {}
    async execute(command: LoginUserCommand) {
        const deviceId = randomUUID();
        const payloadForJwt = {
            userId: command.user._id.toString(),
            deviceId,
        };
        const accessToken = this.jwtService.sign(payloadForJwt, { expiresIn: '10m', secret: 'local' });
        const refreshToken = this.jwtService.sign(payloadForJwt, { expiresIn: '5d', secret: 'refresh' });

        const decodedData = this.jwtService.decode(refreshToken);

        const dateDevices = new Date(Number(decodedData.iat) * 1000);

        await this.commandBus.execute(new CreateSessionCommand(command.ip, command.userAgent, payloadForJwt, refreshToken, dateDevices));
        return {
            jwt: accessToken,
            refresh: refreshToken,
        };
    }
}
