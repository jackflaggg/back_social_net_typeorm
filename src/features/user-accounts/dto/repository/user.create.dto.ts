import { createZodDto } from 'nestjs-zod';
import { UserCreateCommand } from '@libs/contracts/commands/user/create.command';

export class UserCreateDtoToRepo extends createZodDto(UserCreateCommand.RequestSchema) {}
