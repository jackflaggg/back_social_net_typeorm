import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
    ForbiddenDomainException,
    NotFoundDomainException,
    UnauthorizedDomainException,
} from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { UserJwtPayloadDto } from '../../../strategies/refresh.strategy';
import { SessionsPgRepository } from '../../../infrastructure/postgres/sessions/sessions.pg.repository';

export class LogoutUserCommand {
    constructor(public readonly dtoUser: UserJwtPayloadDto) {}
}

@CommandHandler(LogoutUserCommand)
export class LogoutUserUseCase implements ICommandHandler<LogoutUserCommand> {
    constructor(@Inject() private readonly sessionRepository: SessionsPgRepository) {}

    async execute(command: LogoutUserCommand) {
        if (!command.dtoUser || !command.dtoUser.deviceId) {
            throw UnauthorizedDomainException.create();
        }

        const currentDevice = await this.sessionRepository.findSessionByDeviceId(command.dtoUser.deviceId);

        if (!currentDevice) {
            throw NotFoundDomainException.create('девайс не найден!');
        }

        const isOwner = currentDevice.userId === command.dtoUser.userId;

        if (!isOwner) {
            throw ForbiddenDomainException.create('этот девайс не ваш!');
        }

        await this.sessionRepository.removeOldSession(currentDevice.id);
    }
}
