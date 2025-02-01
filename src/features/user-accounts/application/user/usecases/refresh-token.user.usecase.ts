import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { UpdateSessionCommand } from '../../device/usecases/update-session.usecase';
import { SessionRepository } from '../../../infrastructure/sessions/session.repository';

export class RefreshTokenUserCommand {
    constructor(public readonly dto: { userId: string; deviceId: string; ip: string; agent: string }) {}
}

@CommandHandler(RefreshTokenUserCommand)
export class RefreshTokenUserUseCase implements ICommandHandler<RefreshTokenUserCommand> {
    constructor(
        private readonly jwtService: JwtService,
        private readonly commandBus: CommandBus,
        private readonly sessionRepository: SessionRepository,
    ) {}
    async execute(command: RefreshTokenUserCommand) {
        const payloadForJwt = {
            userId: command.dto.userId,
            deviceId: command.dto.deviceId,
        };
        const result = await this.sessionRepository;

        const accessToken = this.jwtService.sign(
            { deviceId: command.dto.deviceId, userId: command.dto.userId },
            { expiresIn: '10s', secret: 'envelope' },
        );
        const refreshToken = this.jwtService.sign(payloadForJwt, { expiresIn: '20s', secret: 'envelope' });

        await this.commandBus.execute(new UpdateSessionCommand(payloadFromJwt, command.dto.ip, refreshToken));
        return {
            jwt: accessToken,
            refresh: refreshToken,
        };
    }
}
