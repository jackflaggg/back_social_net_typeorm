import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepositoryOrm } from '../../../infrastructure/typeorm/sessions/sessions.orm.repository';
import { SecurityDeviceToUser } from '../../../domain/typeorm/device/device.entity';
import { UserRepositoryOrm } from '../../../infrastructure/typeorm/user/user.orm.repo';
import { User } from '../../../domain/typeorm/user/user.entity';

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
        private readonly sessionRepository: SessionsRepositoryOrm,
        private readonly userRepository: UserRepositoryOrm,
    ) {}
    async execute(command: CreateSessionCommand): Promise<void> {
        const sessionDate = {
            deviceId: command.deviceId,
            ip: command.ip,
            userAgent: command.userAgent,
            userId: command.userId,
            createdAt: command.dateDevice,
        };

        const findUser: User = await this.userRepository.findUserById(sessionDate.userId);

        const session: SecurityDeviceToUser = SecurityDeviceToUser.buildInstance(sessionDate, findUser);

        await this.sessionRepository.save(session);
    }
}
