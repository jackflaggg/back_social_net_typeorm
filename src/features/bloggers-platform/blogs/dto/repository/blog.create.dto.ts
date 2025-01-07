import { createZodDto } from 'nestjs-zod';
import { BlogCreateCommand } from '@libs/contracts/commands/blog/create.command';

export class BlogCreateDtoToRepo extends createZodDto(BlogCreateCommand.RequestSchema) {}
