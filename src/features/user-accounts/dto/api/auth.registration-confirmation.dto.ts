import { createZodDto } from 'nestjs-zod';
import { RegistrationConfirmationCommand } from '@libs/contracts/commands/auth/registration-confirmation.command';

export class AuthRegistrationConfirmationDtoApi extends createZodDto(RegistrationConfirmationCommand.RequestSchema) {}
