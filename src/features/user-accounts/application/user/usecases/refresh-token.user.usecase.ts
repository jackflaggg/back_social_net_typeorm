import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserJwtPayloadDto } from '../../../../../core/guards/passport/strategies/refresh.strategy';
import { JwtService } from '@nestjs/jwt';
import { SessionRepository } from '../../../infrastructure/sessions/session.repository';
import { UnauthorizedDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';

export class RefreshTokenUserCommand {
    constructor(public readonly dto: UserJwtPayloadDto) {}
}

@CommandHandler(RefreshTokenUserCommand)
export class RefreshTokenUserUseCase implements ICommandHandler<RefreshTokenUserCommand> {
    constructor(
        private readonly jwtService: JwtService,
        private readonly sessionRepository: SessionRepository,
    ) {}
    async execute(command: RefreshTokenUserCommand) {
        const result = await this.sessionRepository.findDeviceByToken(command.dto);

        if (!result) {
            throw UnauthorizedDomainException.create();
        }

        const payloadForJwt = {
            deviceId: command.dto.deviceId,
            userId: command.dto.userId,
        };

        const accessToken = this.jwtService.sign(
            { deviceId: command.dto.deviceId, userId: command.dto.userId },
            { expiresIn: '10s', secret: 'envelope' },
        );
        const refreshToken = this.jwtService.sign(payloadForJwt, { expiresIn: '20s', secret: 'envelope' });

        result.updateSession(result.issuedAt, refreshToken);
        await this.sessionRepository.save(result);

        return {
            jwt: accessToken,
            refresh: refreshToken,
        };
    }
}
