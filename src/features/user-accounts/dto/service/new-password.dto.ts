import { createZodDto } from 'nestjs-zod';
import { NewPasswordCommand } from '@libs/contracts/commands/auth/new-password.command';

export class NewPasswordDtoService extends createZodDto(NewPasswordCommand.RequestSchema) {}
