import { createZodDto } from 'nestjs-zod';
import { RegistrationCommand } from '@libs/contracts/commands/auth/registration.command';

export class RegistrationDtoService extends createZodDto(RegistrationCommand.RequestSchema) {}
