import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
    ForbiddenDomainException,
    NotFoundDomainException,
    UnauthorizedDomainException,
} from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { SessionRepository } from '../../../infrastructure/mongoose/sessions/session.repository';

export class DeleteSessionCommand {
    constructor(
        public readonly userId: string,
        public readonly deviceId: string,
    ) {}
}

@CommandHandler(DeleteSessionCommand)
export class DeleteSessionUseCase implements ICommandHandler<DeleteSessionCommand> {
    constructor(private readonly sessionRepository: SessionRepository) {}
    async execute(command: DeleteSessionCommand) {
        if (!command.deviceId) {
            throw UnauthorizedDomainException.create();
        }
        const device = await this.sessionRepository.findDeviceById(command.deviceId);

        if (!device) {
            throw NotFoundDomainException.create('не найден девайс', 'sessionRepository');
        }
        const isOwner = device.userId === command.userId;

        if (!isOwner) {
            throw ForbiddenDomainException.create('Access forbidden');
        }
        device.makeDeleted();
        await this.sessionRepository.save(device);
    }
}
