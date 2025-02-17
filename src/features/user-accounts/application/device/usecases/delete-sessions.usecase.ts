import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserJwtPayloadDto } from '../../../strategies/refresh.strategy';
import { SessionRepository } from '../../../infrastructure/mongoose/sessions/session.repository';

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
