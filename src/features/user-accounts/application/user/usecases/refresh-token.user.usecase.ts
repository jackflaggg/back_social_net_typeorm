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
            { expiresIn: '5m', secret: 'envelope' },
        );
        const refreshToken = this.jwtService.sign(payloadForJwt, { expiresIn: '10m', secret: 'envelope' });

        const update = await this.sessionRepository.updateSession(result._id.toString(), result.issuedAt, refreshToken);

        console.log(update);
        return {
            jwt: accessToken,
            refresh: refreshToken,
        };
    }
}
