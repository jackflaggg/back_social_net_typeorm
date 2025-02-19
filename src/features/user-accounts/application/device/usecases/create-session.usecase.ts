import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsPgRepository } from '../../../infrastructure/postgres/sessions/sessions.pg.repository';

export class CreateSessionCommand {
    constructor(
        public readonly ip: string,
        public readonly userAgent: string,
        public readonly deviceId: string,
        public readonly userId: string,
        public readonly dateDevice: Date,
    ) {}
}

@CommandHandler(CreateSessionCommand)
export class CreateSessionUseCase implements ICommandHandler<CreateSessionCommand> {
    constructor(private readonly sessionRepository: SessionsPgRepository) {}
    async execute(command: CreateSessionCommand) {
        return await this.sessionRepository.createSession(
            command.ip,
            command.userAgent,
            command.deviceId,
            command.userId,
            command.dateDevice,
        );
    }
}
