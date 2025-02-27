import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'node:crypto';
import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateSessionCommand } from '../../device/usecases/create-session.usecase';
import { CoreConfig } from '../../../../../core/config/core.config';

// u."id", u."email", u."password_hash" AS "password", em."is_confirmed" AS "isConfirmed"
export interface findUserByLoginOrEmailInterface {
    id: string;
    email: string;
    password: string;
    isConfirmed: boolean;
    confirmationCode: string;
}

export class LoginUserCommand {
    constructor(
        public readonly ip: string = '255.255.255.0',
        public readonly userAgent: string = 'google',
        public readonly user: findUserByLoginOrEmailInterface,
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
        // 1. генерирую девайсАйди
        const deviceId = randomUUID();

        // 2. генерирую два токена
        const accessToken = this.jwtService.sign(
            { userId: command.user.id, deviceId },
            { expiresIn: this.coreConfig.accessTokenExpirationTime, secret: this.coreConfig.accessTokenSecret },
        );
        const refreshToken = this.jwtService.sign(
            { userId: command.user.id, deviceId },
            { expiresIn: this.coreConfig.refreshTokenExpirationTime, secret: this.coreConfig.refreshTokenSecret },
        );

        // 3. декодирую данные, чтобы получить дату протухания токена
        const decodedData = this.jwtService.decode(refreshToken);

        const issuedAtRefreshToken = new Date(Number(decodedData.iat) * 1000);

        // 4. создаю сессию
        await this.commandBus.execute(
            new CreateSessionCommand(command.ip, command.userAgent, deviceId, command.user.id, issuedAtRefreshToken),
        );
        return {
            jwt: accessToken,
            refresh: refreshToken,
        };
    }
}
