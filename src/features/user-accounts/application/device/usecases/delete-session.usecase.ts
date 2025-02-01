import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../../infrastructure/sessions/session.repository';
import { ForbiddenDomainException, NotFoundDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';

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
            throw NotFoundDomainException.create('Device not found');
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
