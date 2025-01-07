import { createZodDto } from 'nestjs-zod';
import { BlogUpdateCommand } from '@libs/contracts/commands/blog/update.command';

export class BlogUpdateDtoToRepo extends createZodDto(BlogUpdateCommand.RequestSchema) {}
