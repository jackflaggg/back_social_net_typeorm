import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'node:crypto';
import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateSessionCommand } from '../../device/usecases/create-session.usecase';
import { AppConfig } from '../../../../../core/config/app.config';
import { findUserByLoginOrEmailInterface } from 'src/features/user-accounts/dto/api/user.in.jwt.find.dto';
import { UserLoggedInEvent } from '../event-handlers/logUserInformationWhenUserLoggedInEventHandler';

export class LoginUserCommand {
    constructor(
        public readonly ip: string,
        public readonly userAgent: string,
        public readonly user: findUserByLoginOrEmailInterface,
    ) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserUseCase implements ICommandHandler<LoginUserCommand> {
    constructor(
        @Inject() private readonly jwtService: JwtService,
        private readonly commandBus: CommandBus,
        private readonly appConfig: AppConfig,
        private readonly eventBus: EventBus,
    ) {}

    async execute(command: LoginUserCommand) {
        // 1. генерирую девайсАйди
        const deviceId: string = randomUUID();

        // 2. генерирую два токена
        const accessToken: string = this.jwtService.sign(
            { userId: command.user.id, deviceId },
            { expiresIn: this.appConfig.accessTokenExpirationTime, secret: this.appConfig.accessTokenSecret },
        );
        const refreshToken: string = this.jwtService.sign(
            { userId: command.user.id, deviceId },
            { expiresIn: this.appConfig.refreshTokenExpirationTime, secret: this.appConfig.refreshTokenSecret },
        );

        // 3. декодирую данные, чтобы получить дату протухания токена
        const decodedData = this.jwtService.decode(refreshToken);

        const issuedAtRefreshToken: Date = new Date(Number(decodedData.iat) * 1000);

        // 4. создаю сессию
        await this.commandBus.execute(
            new CreateSessionCommand(command.ip, command.userAgent, deviceId, command.user.id, issuedAtRefreshToken),
        );

        this.eventBus.publish(new UserLoggedInEvent(command.user.id));

        return {
            jwt: accessToken,
            refresh: refreshToken,
        };
    }
}
