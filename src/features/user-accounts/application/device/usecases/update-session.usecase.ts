import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../../infrastructure/sessions/session.repository';
import { UserJwtPayloadDto } from '../../../../../core/guards/passport/strategies/refresh.strategy';

export class UpdateSessionCommand {
    constructor(
        public readonly dto: UserJwtPayloadDto,
        public readonly refreshToken: string,
    ) {}
}

@CommandHandler(UpdateSessionCommand)
export class UpdateSessionUseCase implements ICommandHandler<UpdateSessionCommand> {
    constructor(private readonly sessionRepository: SessionRepository) {}
    async execute(command: UpdateSessionCommand) {
        await this.sessionRepository.updateSession(command.dto, command.refreshToken);
    }
}
