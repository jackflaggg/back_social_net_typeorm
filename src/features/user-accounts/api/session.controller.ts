import { CommandBus } from '@nestjs/cqrs';
import { RefreshAuthGuard } from '../../../core/guards/passport/guards/refresh.auth.guard';
import { DeleteSessionCommand } from '../application/device/usecases/delete-session.usecase';
import { UserJwtPayloadDto } from '../../../core/guards/passport/strategies/refresh.strategy';
import { ExtractUserFromRequest } from '../../../core/decorators/param/validate.user.decorators';
import { SessionQueryRepository } from '../infrastructure/sessions/query/session.query.repository';
import { DeleteSessionsCommand } from '../application/device/usecases/delete-sessions.usecase';
import { ValidateUUIDPipe } from '../../../core/pipes/validation.input.uuid';
import { Controller, Delete, Get, HttpCode, HttpStatus, Param, UseGuards } from '@nestjs/common';

@Controller('security/devices')
export class SessionController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly sessionQueryRepository: SessionQueryRepository,
    ) {}

    @UseGuards(RefreshAuthGuard)
    @Get()
    async getAllSessions(@ExtractUserFromRequest() dto: UserJwtPayloadDto) {
        return this.sessionQueryRepository.getSessions(dto.userId);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(RefreshAuthGuard)
    @Delete(':deviceId')
    async deleteSession(@Param('deviceId', ValidateUUIDPipe) deviceId: string, @ExtractUserFromRequest() dto: UserJwtPayloadDto) {
        return this.commandBus.execute(new DeleteSessionCommand(dto.userId, deviceId));
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(RefreshAuthGuard)
    @Delete()
    async deleteSessions(@ExtractUserFromRequest() dto: UserJwtPayloadDto) {
        return this.commandBus.execute(new DeleteSessionsCommand(dto));
    }
}
