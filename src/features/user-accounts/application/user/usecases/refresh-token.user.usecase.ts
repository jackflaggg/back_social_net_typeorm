import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { SessionRepository } from '../../../infrastructure/sessions/session.repository';
import { CreateSessionCommand } from '../../device/usecases/create-session.usecase';
import { SETTINGS } from '../../../../../core/settings';

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
        private readonly sessionRepository: SessionRepository,
    ) {}
    async execute(command: RefreshTokenUserCommand) {
        if (!command.userId) {
            throw UnauthorizedDomainException.create();
        }
        // таким образом я удаляю старую сессию при обновлении!
        const session = await this.sessionRepository.findDeviceById(command.deviceId);
        if (!session) {
            throw UnauthorizedDomainException.create('возможно это удаленная сессия!', 'sessionRepository');
        }
        session.makeDeleted();
        await this.sessionRepository.save(session);

        // генерация новых токенов
        const userId = command.userId;
        const deviceId = command.deviceId;

        const refreshToken = this.jwtService.sign({ userId, deviceId }, { expiresIn: '20s', secret: SETTINGS.SECRET_KEY });
        const accessToken = this.jwtService.sign({ userId, deviceId }, { expiresIn: '10s', secret: SETTINGS.SECRET_KEY });

        const decodedData = this.jwtService.decode(refreshToken);
        const dateDevices = new Date(Number(decodedData.iat) * 1000);

        await this.commandBus.execute(new CreateSessionCommand(command.ip, command.userAgent, deviceId, userId, dateDevices));
        return {
            jwt: accessToken,
            refresh: refreshToken,
        };
    }
}
