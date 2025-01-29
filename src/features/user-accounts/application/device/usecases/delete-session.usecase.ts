import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../../infrastructure/sessions/session.repository';
import { UserJwtPayloadDto } from '../../../../../core/guards/passport/strategies/refresh.strategy';
import { NotFoundDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';

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
        const device = await this.sessionRepository.findDeviceById(command.deviceId);
        if (!device) {
            throw NotFoundDomainException.create('не найден девайс', 'sessionRepository');
        }
        device.makeDeleted();
        await this.sessionRepository.save(device);
    }
}
