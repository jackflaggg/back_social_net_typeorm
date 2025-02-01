import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { SessionRepository } from '../../../infrastructure/sessions/session.repository';
import {
    NotFoundDomainException,
    UnauthorizedDomainException,
} from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';

export class LogoutUserCommand {
    constructor(public readonly refreshToken: string | null) {}
}

@CommandHandler(LogoutUserCommand)
export class LogoutUserUseCase implements ICommandHandler<LogoutUserCommand> {
    constructor(@Inject() private readonly sessionRepository: SessionRepository) {}

    async execute(command: LogoutUserCommand) {
        if (!command.refreshToken) {
            throw UnauthorizedDomainException.create();
        }
        const currentDevice = await this.sessionRepository.findDeviceByRefreshToken(command.refreshToken);

        if (!currentDevice) {
            throw NotFoundDomainException.create('Device not found');
        }

        currentDevice.makeDeleted();
        await this.sessionRepository.save(currentDevice);
    }
}
