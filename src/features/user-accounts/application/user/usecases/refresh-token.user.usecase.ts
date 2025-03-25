import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { CreateSessionCommand } from '../../device/usecases/create-session.usecase';
import { AppConfig } from '../../../../../core/config/app.config';
import { SessionsRepositoryOrm } from '../../../infrastructure/typeorm/sessions/sessions.orm.repository';

export class RefreshTokenUserCommand {
    constructor(
        public readonly userId: string,
        public readonly deviceId: string,
        public readonly ip: string,
        public readonly userAgent: string,
    ) {}
}

@CommandHandler(RefreshTokenUserCommand)
export class RefreshTokenUserUseCase implements ICommandHandler<RefreshTokenUserCommand> {
    constructor(
        private readonly jwtService: JwtService,
        private readonly commandBus: CommandBus,
        private readonly sessionRepository: SessionsRepositoryOrm,
        private readonly coreConfig: AppConfig,
    ) {}
    async execute(command: RefreshTokenUserCommand) {
        const session = await this.sessionRepository.findSessionByDeviceId(command.deviceId);

        if (!session) {
            throw UnauthorizedDomainException.create('возможно это удаленная сессия!', 'sessionRepository');
        }

        // я не удаляю сессию, я лишь ее обновляю!
        await this.sessionRepository.updateSession(session);

        // генерация новых токенов
        const userId = command.userId;
        const deviceId = command.deviceId;

        const refreshToken = this.jwtService.sign(
            { userId, deviceId },
            { expiresIn: this.coreConfig.refreshTokenExpirationTime, secret: this.coreConfig.refreshTokenSecret },
        );
        const accessToken = this.jwtService.sign(
            { userId, deviceId },
            { expiresIn: this.coreConfig.accessTokenExpirationTime, secret: this.coreConfig.accessTokenSecret },
        );

        const decodedRefreshToken = this.jwtService.decode(refreshToken);
        const issuedAtRefreshToken = new Date(Number(decodedRefreshToken.iat) * 1000);

        await this.commandBus.execute(new CreateSessionCommand(command.ip, command.userAgent, deviceId, userId, issuedAtRefreshToken));
        return {
            jwt: accessToken,
            refresh: refreshToken,
        };
    }
}
