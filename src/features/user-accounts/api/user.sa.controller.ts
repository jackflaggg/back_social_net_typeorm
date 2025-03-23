import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { UserCreateDtoApi } from '../dto/api/user.create.dto';
import { GetUsersQueryParams } from '../dto/api/get-users-query-params.input-dto';
import { BasicAuthGuard } from '../../../core/guards/passport/guards/basic.auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../application/user/usecases/create-user.usecase';
import { DeleteUserCommand } from '../application/user/usecases/delete-user.usecase';
import { SETTINGS } from '../../../core/settings';
import { UserQueryRepositoryOrm } from '../infrastructure/typeorm/user/query/user.query.orm.repo';
import { ValidateUUIDPipe } from '../../../core/pipes/validation.input.uuid';

@UseGuards(BasicAuthGuard)
@Controller(SETTINGS.PATH.SA_USERS)
export class UserSaController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly userQueryRepository: UserQueryRepositoryOrm,
    ) {}

    @Post()
    async createUser(@Body() dto: UserCreateDtoApi) {
        const userId = await this.commandBus.execute(new CreateUserCommand(dto));
        return this.userQueryRepository.getUser(userId);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    async deleteUser(@Param('id', ValidateUUIDPipe) id: string) {
        return this.commandBus.execute(new DeleteUserCommand(id));
    }

    @Get()
    async getAllUsers(@Query() query: GetUsersQueryParams) {
        return this.userQueryRepository.getAllUsers(query);
    }
}
