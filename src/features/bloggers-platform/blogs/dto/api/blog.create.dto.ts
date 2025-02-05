import { createZodDto } from 'nestjs-zod';
import { BlogCreateCommand } from '../../../../../libs/contracts/commands/blog/create.command';

export class BlogCreateDtoApi extends createZodDto(BlogCreateCommand.RequestSchema) {}
