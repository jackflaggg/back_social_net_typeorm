import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserJwtPayloadDto } from '../../../strategies/refresh.strategy';
import { NotFoundDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { SessionsPgRepository } from '../../../infrastructure/postgres/sessions/sessions.pg.repository';

export class UpdateSessionCommand {
    constructor(public readonly dto: UserJwtPayloadDto) {}
}

@CommandHandler(UpdateSessionCommand)
export class UpdateSessionUseCase implements ICommandHandler<UpdateSessionCommand> {
    constructor(private readonly sessionRepository: SessionsPgRepository) {}
    async execute(command: UpdateSessionCommand) {
        const session = await this.sessionRepository.findSessionByDeviceId(command.dto.deviceId);
        if (!session) {
            throw NotFoundDomainException.create();
        }
        await this.sessionRepository.updateSession(new Date(command.dto.iat * 1000).toISOString(), command.dto.deviceId);
    }
}
