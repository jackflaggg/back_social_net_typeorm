import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserJwtPayloadDto } from '../../../strategies/refresh.strategy';
import { NotFoundDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { SessionRepository } from '../../../infrastructure/mongoose/sessions/session.repository';

export class UpdateSessionCommand {
    constructor(public readonly dto: UserJwtPayloadDto) {}
}

@CommandHandler(UpdateSessionCommand)
export class UpdateSessionUseCase implements ICommandHandler<UpdateSessionCommand> {
    constructor(private readonly sessionRepository: SessionRepository) {}
    async execute(command: UpdateSessionCommand) {
        const session = await this.sessionRepository.findDeviceById(command.dto.deviceId);
        if (!session) {
            throw NotFoundDomainException.create();
        }
        session.updateSession(command.dto.iat, command.dto.deviceId);
        await this.sessionRepository.save(session);
    }
}
