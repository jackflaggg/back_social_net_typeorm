import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { CreateSessionCommand } from '../../device/usecases/create-session.usecase';
import { CoreConfig } from '../../../../../core/config/core.config';
import { SessionsPgRepository } from '../../../infrastructure/postgres/sessions/sessions.pg.repository';

export class RefreshTokenUserCommand {
    constructor(
        public readonly userId: string,
        public readonly deviceId: string,
        public readonly ip: string = '255.255.255.0',
        public readonly userAgent: string = 'google',
    ) {}
}

@CommandHandler(RefreshTokenUserCommand)
export class RefreshTokenUserUseCase implements ICommandHandler<RefreshTokenUserCommand> {
    constructor(
        private readonly jwtService: JwtService,
        private readonly commandBus: CommandBus,
        private readonly sessionRepository: SessionsPgRepository,
        private readonly coreConfig: CoreConfig,
    ) {}
    async execute(command: RefreshTokenUserCommand) {
        if (!command.userId) {
            throw UnauthorizedDomainException.create();
        }
        // таким образом я удаляю старую сессию при обновлении!

        const session = await this.sessionRepository.findSessionByDeviceId(command.deviceId);

        if (!session) {
            throw UnauthorizedDomainException.create('возможно это удаленная сессия!', 'sessionRepository');
        }

        await this.sessionRepository.deleteSession(session.id);

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

        const decodedData = this.jwtService.decode(refreshToken);
        const issuedAtRefreshToken = new Date(Number(decodedData.iat) * 1000);

        await this.commandBus.execute(new CreateSessionCommand(command.ip, command.userAgent, deviceId, userId, issuedAtRefreshToken));
        return {
            jwt: accessToken,
            refresh: refreshToken,
        };
    }
}
