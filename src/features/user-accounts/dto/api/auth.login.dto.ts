import { createZodDto } from 'nestjs-zod';
import { UserLoginCommand } from '@libs/contracts/commands/auth/login.command';

export class AuthLoginDtoApi extends createZodDto(UserLoginCommand.RequestSchema) {}
