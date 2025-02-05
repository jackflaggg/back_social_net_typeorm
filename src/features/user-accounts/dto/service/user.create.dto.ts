import { createZodDto } from 'nestjs-zod';
import { UserCreateCommand } from 'libs/contracts/commands/user/create.command';

export class UserCreateDtoService extends createZodDto(UserCreateCommand.RequestSchema) {}
