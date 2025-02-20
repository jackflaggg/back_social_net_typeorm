import { CommandBus } from '@nestjs/cqrs';
import { RefreshAuthGuard } from '../../../core/guards/passport/guards/refresh.auth.guard';
import { DeleteSessionCommand } from '../application/device/usecases/delete-session.usecase';
import { UserJwtPayloadDto } from '../strategies/refresh.strategy';
import { ExtractAnyUserFromRequest } from '../../../core/decorators/param/validate.user.decorators';
import { DeleteSessionsCommand } from '../application/device/usecases/delete-sessions.usecase';
import { Controller, Delete, Get, HttpCode, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { SessionQueryPgRepository } from '../infrastructure/postgres/sessions/query/sessions.pg.query.repository';
import { ValidateUUIDPipe } from '../../../core/pipes/validation.input.uuid';

@Controller('security')
export class SessionController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly sessionQueryRepository: SessionQueryPgRepository,
    ) {}

    @UseGuards(RefreshAuthGuard)
    @Get('devices')
    async getAllSessions(@ExtractAnyUserFromRequest() dto: UserJwtPayloadDto) {
        return this.sessionQueryRepository.getSessions(dto.userId);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(RefreshAuthGuard)
    @Delete('devices/:deviceId')
    async deleteSession(@Param('deviceId', ValidateUUIDPipe) deviceId: string, @ExtractAnyUserFromRequest() dto: UserJwtPayloadDto) {
        return this.commandBus.execute(new DeleteSessionCommand(dto.userId, deviceId));
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(RefreshAuthGuard)
    @Delete('devices')
    async deleteSessions(@ExtractAnyUserFromRequest() dto: UserJwtPayloadDto) {
        return this.commandBus.execute(new DeleteSessionsCommand(dto));
    }
}
