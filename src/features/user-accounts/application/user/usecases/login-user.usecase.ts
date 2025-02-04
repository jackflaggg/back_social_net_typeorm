import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'node:crypto';
import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateSessionCommand } from '../../device/usecases/create-session.usecase';
import { CoreConfig } from '../../../../../core/config/core.config';

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
        private readonly coreConfig: CoreConfig,
    ) {}
    async execute(command: LoginUserCommand) {
        const deviceId = randomUUID();
        const accessToken = this.jwtService.sign(
            { userId: command.user._id.toString(), deviceId },
            { expiresIn: this.coreConfig.accessTokenExpirationTime, secret: this.coreConfig.accessTokenSecret },
        );
        const refreshToken = this.jwtService.sign(
            { userId: command.user._id.toString(), deviceId },
            { expiresIn: this.coreConfig.refreshTokenExpirationTime, secret: this.coreConfig.refreshTokenSecret },
        );

        const decodedData = this.jwtService.decode(refreshToken);

        const issuedAtRefreshToken = new Date(Number(decodedData.iat) * 1000);

        await this.commandBus.execute(
            new CreateSessionCommand(command.ip, command.userAgent, deviceId, command.user._id.toString(), issuedAtRefreshToken),
        );
        return {
            jwt: accessToken,
            refresh: refreshToken,
        };
    }
}
