import { Controller, Delete, Get, HttpCode, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { BasicAuthGuard } from '../../../core/guards/passport/guards/basic.auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { UserQueryRepository } from '../infrastructure/user/query/user.query.repository';
import { RefreshAuthGuard } from '../../../core/guards/passport/guards/refresh.auth.guard';
import { DeleteSessionCommand } from '../application/device/usecases/delete-session.usecase';
import { UserJwtPayloadDto } from '../../../core/guards/passport/strategies/refresh.strategy';
import { ExtractUserFromRequest } from '../../../core/decorators/param/validate.user.decorators';

@UseGuards(BasicAuthGuard)
@Controller('devices')
export class UserController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly userQueryRepository: UserQueryRepository,
    ) {}

    @UseGuards(RefreshAuthGuard)
    @Get()
    async getAllSessions() {}

    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(RefreshAuthGuard)
    @Delete(':id')
    async deleteSession(@Param('id') id: string, @ExtractUserFromRequest() user: UserJwtPayloadDto) {
        return this.commandBus.execute(new DeleteSessionCommand(user.userId, id));
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(RefreshAuthGuard)
    @Delete()
    async deleteSessions() {}
}
