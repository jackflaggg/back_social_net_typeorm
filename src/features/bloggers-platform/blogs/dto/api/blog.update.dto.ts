import { createZodDto } from 'nestjs-zod';
import { BlogUpdateCommand } from 'libs/contracts/commands/blog/update.command';

export class BlogUpdateDtoApi extends createZodDto(BlogUpdateCommand.RequestSchema) {}
