import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query, UseGuards, UsePipes } from '@nestjs/common';
import { UserService } from '../application/user/user.service';
import { UserQueryRepository } from '../infrastructure/query/user.query.repository';
import { UserCreateDtoApi } from '../dto/api/user.create.dto';
import { GetUsersQueryParams } from '../dto/api/get-users-query-params.input-dto';
import { BasicAuthGuard } from '../../../core/guards/passport/guards/basic.auth.guard';

@UseGuards(BasicAuthGuard)
@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly userQueryRepository: UserQueryRepository,
    ) {}

    @Post()
    async createUser(@Body() dto: UserCreateDtoApi) {
        const userId = await this.userService.createUser(dto);
        return this.userQueryRepository.findUser(userId);
    }

    @HttpCode(204)
    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        return this.userService.deleteUser(id);
    }

    @Get()
    async getAllUsers(@Query() query: GetUsersQueryParams) {
        return this.userQueryRepository.getAllUsers(query);
    }
}
