import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { SessionRepository } from '../../../infrastructure/sessions/session.repository';
import {
    ForbiddenDomainException,
    NotFoundDomainException,
    UnauthorizedDomainException,
} from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { UserJwtPayloadDto } from '../../../../../core/guards/passport/strategies/refresh.strategy';

export class LogoutUserCommand {
    constructor(public readonly dtoUser: UserJwtPayloadDto) {}
}

@CommandHandler(LogoutUserCommand)
export class LogoutUserUseCase implements ICommandHandler<LogoutUserCommand> {
    constructor(@Inject() private readonly sessionRepository: SessionRepository) {}

    async execute(command: LogoutUserCommand) {
        if (!command.dtoUser) {
            throw UnauthorizedDomainException.create();
        }

        if (!command.dtoUser.deviceId) {
            throw NotFoundDomainException.create('нет девайса', 'deviceId');
        }
        const currentDevice = await this.sessionRepository.findDeviceById(command.dtoUser.deviceId);

        if (!currentDevice) {
            throw NotFoundDomainException.create('Device not found');
        }
        const isOwner = currentDevice.userId === command.dtoUser.userId;

        if (!isOwner) {
            throw ForbiddenDomainException.create('Access forbidden');
        }
        currentDevice.makeDeleted();
        await this.sessionRepository.save(currentDevice);
    }
}
