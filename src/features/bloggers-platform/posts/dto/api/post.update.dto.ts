import { createZodDto } from 'nestjs-zod';
import { PostUpdateCommand } from '@libs/contracts/commands/post/update.command';

export class PostUpdateDtoApi extends createZodDto(PostUpdateCommand.RequestSchema) {}
