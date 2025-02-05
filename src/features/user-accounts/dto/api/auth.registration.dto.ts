import { createZodDto } from 'nestjs-zod';
import { RegistrationCommand } from '../../../../libs/contracts/commands/auth/registration.command';

export class AuthRegistrationDtoApi extends createZodDto(RegistrationCommand.RequestSchema) {}
