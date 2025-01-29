import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserJwtPayloadDto } from '../../../../../core/guards/passport/strategies/refresh.strategy';
import { UserRepository } from '../../../infrastructure/user/user.repository';
import { JwtService } from '@nestjs/jwt';
import { SessionRepository } from '../../../infrastructure/sessions/session.repository';

export class RefreshTokenUserCommand {
    constructor(public readonly dto: UserJwtPayloadDto) {}
}

@CommandHandler(RefreshTokenUserCommand)
export class RefreshTokenUserUseCase implements ICommandHandler<RefreshTokenUserCommand> {
    constructor(private readonly sessionRepository: SessionRepository) {}
    async execute(command: RefreshTokenUserCommand) {
        const result = await this.sessionRepository.findDeviceByToken(command.dto);

        if (!result) {
            throw new ThrowError(nameErr['NOT_AUTHORIZATION']);
        }

        const token = new GenerateTokens(this.jwtService, userId, deviceId);

        const generate = await token.generateTokens();

        await this.securityService.updateSession(result._id, result.issuedAt!, generate.refresh!);

        return {
            jwt: generate.access,
            refresh: generate.refresh,
        };
    }
}
