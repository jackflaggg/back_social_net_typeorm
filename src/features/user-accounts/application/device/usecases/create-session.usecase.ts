import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { DeviceEntity, DeviceModelType } from '../../../domain/device/device.entity';
import { SessionRepository } from '../../../infrastructure/sessions/session.repository';
import { MappingDevice } from '../../../dto/repository/device-view.dto';

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
    constructor(
        private readonly sessionRepository: SessionRepository,
        @InjectModel(DeviceEntity.name) private deviceModel: DeviceModelType,
    ) {}
    async execute(command: CreateSessionCommand) {
        const data = MappingDevice(command.ip, command.userAgent, command.deviceId, command.userId, command.dateDevice);
        const session = this.deviceModel.buildInstance(data);
        await this.sessionRepository.save(session);
        return session._id.toString();
    }
}
