import { createZodDto } from 'nestjs-zod';
import { UserCreateCommand } from '@libs/contracts/commands/user/create.command';

export class UserCreateDtoApi extends createZodDto(UserCreateCommand.RequestSchema) {}
