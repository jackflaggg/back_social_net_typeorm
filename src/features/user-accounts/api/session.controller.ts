import { Controller, Delete, Get, HttpCode, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { BasicAuthGuard } from '../../../core/guards/passport/guards/basic.auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { UserQueryRepository } from '../infrastructure/user/query/user.query.repository';
import { RefreshAuthGuard } from '../../../core/guards/passport/guards/refresh.auth.guard';

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
    @Delete('/:id')
    async deleteSession(@Param('id') id: string) {}

    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(RefreshAuthGuard)
    @Delete()
    async deleteSessions() {}
}
