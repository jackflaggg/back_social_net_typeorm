import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { UserService } from '../application/user.service';
import { UserQueryRepository } from '../infrastructure/query/user.query.repository';
import { UserCreateDtoApi } from '../dto/api/user.create.dto';
import { GetUsersQueryParams } from '../dto/api/get-users-query-params.input-dto';

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly userQueryRepository: UserQueryRepository,
    ) {}
    @Post()
    async createUser(@Body() dto: UserCreateDtoApi) {
        const userId = await this.userService.createUser(dto);
        return await this.userQueryRepository.findUser(userId);
    }

    @HttpCode(204)
    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        await this.userService.deleteUser(id);
    }

    @Get()
    async getAllUsers(@Query() query: GetUsersQueryParams) {
        return await this.userQueryRepository.getAllUsers(query);
    }
}
