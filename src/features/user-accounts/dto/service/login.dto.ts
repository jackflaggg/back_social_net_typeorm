import { createZodDto } from 'nestjs-zod';
import { UserLoginCommand } from '../../../../libs/contracts/commands/auth/login.command';

export class LoginDtoService extends createZodDto(UserLoginCommand.RequestSchema) {}
