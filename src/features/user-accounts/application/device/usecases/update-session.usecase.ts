import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../../infrastructure/sessions/session.repository';

export class UpdateSessionCommand {
    constructor(
        public readonly id: string,
        public readonly issuedAtToken: Date,
        public readonly refreshToken: string,
    ) {}
}

@CommandHandler(UpdateSessionCommand)
export class UpdateSessionUseCase implements ICommandHandler<UpdateSessionCommand> {
    constructor(private readonly sessionRepository: SessionRepository) {}
    async execute(command: UpdateSessionCommand) {
        await this.sessionRepository.updateSession(command.id, command.issuedAtToken, command.refreshToken);
    }
}
