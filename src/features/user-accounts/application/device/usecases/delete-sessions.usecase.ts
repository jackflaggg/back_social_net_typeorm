import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserJwtPayloadDto } from '../../../strategies/refresh.strategy';
import { SessionsPgRepository } from '../../../infrastructure/postgres/sessions/sessions.pg.repository';
import { Inject } from '@nestjs/common';

export class DeleteSessionsCommand {
    constructor(public readonly dto: UserJwtPayloadDto) {}
}

@CommandHandler(DeleteSessionsCommand)
export class DeleteSessionsUseCase implements ICommandHandler<DeleteSessionsCommand> {
    constructor(@Inject() private readonly sessionRepository: SessionsPgRepository) {}
    async execute(command: DeleteSessionsCommand) {
        await this.sessionRepository.deleteAllSessions(command.dto.userId, command.dto.deviceId);
    }
}
