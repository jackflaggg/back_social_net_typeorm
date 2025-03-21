import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserJwtPayloadDto } from '../../../strategies/refresh.strategy';
import { NotFoundDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { SessionsRepositoryOrm } from '../../../infrastructure/typeorm/sessions/sessions.orm.repository';

export class UpdateSessionCommand {
    constructor(public readonly dto: UserJwtPayloadDto) {}
}

@CommandHandler(UpdateSessionCommand)
export class UpdateSessionUseCase implements ICommandHandler<UpdateSessionCommand> {
    constructor(private readonly sessionRepository: SessionsRepositoryOrm) {}
    async execute(command: UpdateSessionCommand) {
        const session = await this.sessionRepository.findSessionByDeviceId(command.dto.deviceId);
        if (!session) {
            throw NotFoundDomainException.create();
        }
    }
}
