import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UserJwtPayloadDto } from '../../../../../core/guards/passport/strategies/refresh.strategy';
import { SessionRepository } from '../../../infrastructure/sessions/session.repository';
import { ForbiddenDomainException, NotFoundDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';

export class LogoutUserCommand {
    constructor(public readonly dto: UserJwtPayloadDto) {}
}

@CommandHandler(LogoutUserCommand)
export class LogoutUserUseCase implements ICommandHandler<LogoutUserCommand> {
    constructor(@Inject() private readonly sessionRepository: SessionRepository) {}

    async execute(command: LogoutUserCommand) {
        if (!command.dto.deviceId) {
            throw NotFoundDomainException.create('Device not found in dto', 'dto');
        }
        const currentDevice = await this.sessionRepository.findDeviceById(command.dto.deviceId);

        if (!currentDevice) {
            throw NotFoundDomainException.create('Device not found');
        }

        const isOwner = currentDevice.userId === command.dto.userId;

        if (!isOwner) {
            throw ForbiddenDomainException.create('Access forbidden');
        }

        currentDevice.makeDeleted();
        await this.sessionRepository.save(currentDevice);
    }
}
