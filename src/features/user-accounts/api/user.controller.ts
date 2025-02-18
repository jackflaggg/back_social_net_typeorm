import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { UserCreateDtoApi } from '../dto/api/user.create.dto';
import { GetUsersQueryParams } from '../dto/api/get-users-query-params.input-dto';
import { BasicAuthGuard } from '../../../core/guards/passport/guards/basic.auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../application/user/usecases/create-user.usecase';
import { DeleteUserCommand } from '../application/user/usecases/delete-user.usecase';
import { ValidateSerialPipe } from '../../../core/pipes/validation.input.serial';
import { UserPgQueryRepository } from '../infrastructure/postgres/user/query/user.pg.query.repository';

@UseGuards(BasicAuthGuard)
@Controller('sa/users')
export class UserController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly userQueryRepository: UserPgQueryRepository,
    ) {}

    @Post()
    async createUser(@Body() dto: UserCreateDtoApi) {
        const userId = await this.commandBus.execute(new CreateUserCommand(dto));
        return this.userQueryRepository.getUser(userId);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    async deleteUser(@Param('id', ValidateSerialPipe) id: string) {
        return this.commandBus.execute(new DeleteUserCommand(id));
    }

    @Get()
    async getAllUsers(@Query() query: GetUsersQueryParams) {
        return this.userQueryRepository.getAllUsers(query);
    }
}
