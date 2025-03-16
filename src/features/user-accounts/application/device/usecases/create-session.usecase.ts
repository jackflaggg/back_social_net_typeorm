import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepositoryOrm } from '../../../infrastructure/typeorm/sessions/sessions.orm.repository';
import { SecurityDeviceToUser } from '../../../domain/typeorm/device/device.entity';

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
        const sessionDate = SecurityDeviceToUser.b;
        return await this.sessionRepository.createSession(
            command.ip,
            command.userAgent,
            command.deviceId,
            command.userId,
            command.dateDevice,
        );
    }
}
