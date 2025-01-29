import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../../infrastructure/sessions/session.repository';
import { InjectModel } from '@nestjs/mongoose';
import { DeviceEntity, DeviceModelType } from '../../../domain/device/device.entity';
import { MappingDevice } from '../../../dto/repository/device-view.dto';

export class DeleteSessionsCommand {
    constructor(
        public readonly ip: string,
        public readonly userAgent: string,
        public readonly payload: any,
        public readonly refreshToken: string,
        public readonly dateDevice: Date,
    ) {}
}

@CommandHandler(DeleteSessionsCommand)
export class DeleteSessionsUseCase implements ICommandHandler<DeleteSessionsCommand> {
    constructor(
        private readonly sessionRepository: SessionRepository,
        @InjectModel(DeviceEntity.name) private deviceModel: DeviceModelType,
    ) {}
    async execute(command: DeleteSessionsCommand) {
        const data = MappingDevice(command.ip, command.userAgent, command.payload, command.refreshToken, command.dateDevice);
        const session = this.deviceModel.buildInstance(data);
        await this.sessionRepository.save(session);
    }
}
