import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { UpdateSessionCommand } from '../../device/usecases/update-session.usecase';
import { UnauthorizedDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';

export class RefreshTokenUserCommand {
    constructor(
        public readonly userId: string,
        public readonly deviceId: string,
    ) {}
}

@CommandHandler(RefreshTokenUserCommand)
export class RefreshTokenUserUseCase implements ICommandHandler<RefreshTokenUserCommand> {
    constructor(
        private readonly jwtService: JwtService,
        private readonly commandBus: CommandBus,
    ) {}
    async execute(command: RefreshTokenUserCommand) {
        if (!command.userId) {
            throw UnauthorizedDomainException.create();
        }
        const userId = command.userId;
        const deviceId = command.deviceId;

        // мне нужно еще найти старый токен и пометить его на удаление!
        const refreshToken = this.jwtService.sign({ userId, deviceId }, { expiresIn: '20s', secret: 'envelope' });
        const accessToken = this.jwtService.sign({ userId, deviceId }, { expiresIn: '10s', secret: 'envelope' });

        const decodedNewRefreshToken = this.jwtService.decode(refreshToken);

        await this.commandBus.execute(new UpdateSessionCommand(decodedNewRefreshToken, refreshToken));
        return {
            jwt: accessToken,
            refresh: refreshToken,
        };
    }
}
