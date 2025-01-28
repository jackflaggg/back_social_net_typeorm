import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { DeviceEntity, DeviceModelType } from '../../../domain/device/device.entity';
import { SessionRepository } from '../../../infrastructure/sessions/session.repository';

export class CreateSessionCommand {
    constructor(
        public readonly ip: string,
        public readonly userAgent: string,
        public readonly payload: any,
        public readonly refreshToken: string,
    ) {}
}

@CommandHandler(CreateSessionCommand)
export class CreateSessionUseCase implements ICommandHandler<CreateSessionCommand> {
    constructor(
        private readonly sessionRepository: SessionRepository,
        @InjectModel(DeviceEntity.name) private deviceModel: DeviceModelType,
    ) {}
    async execute(command: CreateSessionCommand) {
        const data: DeviceEntity = {
            deviceId: command.payload.deviceId,
            userId: command.payload.userId,
            ip: command.ip,
            lastActiveDate: new Date(),
            deviceName: command.userAgent,
            refreshToken: command.refreshToken,
        };
        const session = await this.deviceModel.create(data);
        await this.sessionRepository.save(session);
    }
}
