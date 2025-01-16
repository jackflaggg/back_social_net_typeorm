import { createZodDto } from 'nestjs-zod';
import { RegistrationEmailResendingCommand } from '@libs/contracts/commands/auth/registration-email-resending.command';

export class RegistrationEmailResendingDtoService extends createZodDto(RegistrationEmailResendingCommand.RequestSchema) {}
