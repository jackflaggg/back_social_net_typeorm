import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepositoryOrm } from '../../../infrastructure/typeorm/sessions/sessions.orm.repository';
import { SecurityDeviceToUser } from '../../../domain/typeorm/device/device.entity';
import { randomUUID } from 'node:crypto';

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
    constructor(private readonly sessionRepository: SessionsRepositoryOrm) {}
    async execute(command: CreateSessionCommand) {
        const deviceSessionId = randomUUID();
        const sessionDate = {
            deviceId: deviceSessionId,
            ip: command.ip,
            userAgent: command.userAgent,
            userId: command.userId,
            createdAt: command.dateDevice,
        };
        const session = SecurityDeviceToUser.buildInstance(sessionDate);
        return await this.sessionRepository.save(session);
    }
}
