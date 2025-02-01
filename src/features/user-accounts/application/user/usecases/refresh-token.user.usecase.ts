import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { UpdateSessionCommand } from '../../device/usecases/update-session.usecase';
import { SessionRepository } from '../../../infrastructure/sessions/session.repository';
import { UnauthorizedDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';

export class RefreshTokenUserCommand {
    constructor(public readonly dto: string | null) {}
}

@CommandHandler(RefreshTokenUserCommand)
export class RefreshTokenUserUseCase implements ICommandHandler<RefreshTokenUserCommand> {
    constructor(
        private readonly jwtService: JwtService,
        private readonly commandBus: CommandBus,
        private readonly sessionRepository: SessionRepository,
    ) {}
    async execute(command: RefreshTokenUserCommand) {
        if (!command.dto) {
            throw UnauthorizedDomainException.create();
        }
        const decodedRefreshToken = this.jwtService.decode(command.dto);

        const { userId, deviceId, iat } = decodedRefreshToken;

        const result = await this.sessionRepository.getSessionByDeviceIdAndIat(new Date(Number(iat) * 1000), deviceId);

        if (!result) {
            throw UnauthorizedDomainException.create();
        }
        const accessToken = this.jwtService.sign({ userId, deviceId }, { expiresIn: '10s', secret: 'envelope' });
        const refreshToken = this.jwtService.sign({ userId, deviceId }, { expiresIn: '20s', secret: 'envelope' });

        await this.commandBus.execute(new UpdateSessionCommand(result._id.toString(), result.issuedAt, refreshToken));
        return {
            jwt: accessToken,
            refresh: refreshToken,
        };
    }
}
