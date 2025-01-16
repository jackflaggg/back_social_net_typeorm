import { createZodDto } from 'nestjs-zod';
import { PasswordRecoveryCommand } from '@libs/contracts/commands/auth/password-recovery.command';

export class PasswordRecoveryDtoService extends createZodDto(PasswordRecoveryCommand.RequestSchema) {}
