import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query, UseGuards } from '@nestjs/common';
import { BasicAuthGuard } from '../../../core/guards/passport/guards/basic.auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { UserQueryRepository } from '../infrastructure/user/query/user.query.repository';

//TODO: Написать гард, который будет верифицировать рефрештокен
@UseGuards(BasicAuthGuard)
@Controller('devices')
export class UserController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly userQueryRepository: UserQueryRepository,
    ) {}

    @Get()
    async getAllSessions() {}

    @HttpCode(204)
    @Delete(':id')
    async deleteSession(@Param('id') id: string) {}

    @Get()
    async deleteSessions() {}
}
