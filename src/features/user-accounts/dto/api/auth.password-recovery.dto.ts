import { createZodDto } from 'nestjs-zod';
import { PasswordRecoveryCommand } from '@libs/contracts/commands/auth/password-recovery.command';

export class AuthPasswordRecoveryDtoApi extends createZodDto(PasswordRecoveryCommand.RequestSchema) {}
