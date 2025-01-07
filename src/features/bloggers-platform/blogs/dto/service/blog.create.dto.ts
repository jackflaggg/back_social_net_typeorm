import { createZodDto } from 'nestjs-zod';
import { BlogCreateCommand } from '@libs/contracts/commands/blog/create.command';

export class BlogCreateDtoService extends createZodDto(BlogCreateCommand.RequestSchema) {}
