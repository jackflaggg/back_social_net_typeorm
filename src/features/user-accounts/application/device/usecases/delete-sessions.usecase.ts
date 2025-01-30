import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../../infrastructure/sessions/session.repository';
import { UserJwtPayloadDto } from '../../../../../core/guards/passport/strategies/refresh.strategy';

export class DeleteSessionsCommand {
    constructor(public readonly dto: UserJwtPayloadDto) {}
}

@CommandHandler(DeleteSessionsCommand)
export class DeleteSessionsUseCase implements ICommandHandler<DeleteSessionsCommand> {
    constructor(private readonly sessionRepository: SessionRepository) {}
    async execute(command: DeleteSessionsCommand) {
        await this.sessionRepository.deleteAllSession(command.dto.userId, command.dto.deviceId);
    }
}
