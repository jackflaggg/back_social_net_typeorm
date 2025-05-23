import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
    ForbiddenDomainException,
    NotFoundDomainException,
    UnauthorizedDomainException,
} from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { SessionsRepositoryOrm } from '../../../infrastructure/typeorm/sessions/sessions.orm.repository';

export class DeleteSessionCommand {
    constructor(
        public readonly userId: string,
        public readonly deviceId: string,
    ) {}
}

@CommandHandler(DeleteSessionCommand)
export class DeleteSessionUseCase implements ICommandHandler<DeleteSessionCommand> {
    constructor(private readonly sessionRepository: SessionsRepositoryOrm) {}
    async execute(command: DeleteSessionCommand) {
        if (!command.deviceId) {
            throw UnauthorizedDomainException.create();
        }
        const device = await this.sessionRepository.findSessionByDeviceId(command.deviceId);

        if (!device) {
            throw NotFoundDomainException.create('не найден девайс', 'sessionRepository');
        }
        const isOwner = String(device.user.id) === command.userId;

        if (!isOwner) {
            throw ForbiddenDomainException.create('Это не твой девайс!');
        }
        await this.sessionRepository.deleteSession(device);
    }
}
