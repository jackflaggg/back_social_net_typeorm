import { createZodDto } from 'nestjs-zod';
import { NewPasswordCommand } from '../../../../libs/contracts/commands/auth/new-password.command';

export class AuthNewPasswordDtoApi extends createZodDto(NewPasswordCommand.RequestSchema) {}
