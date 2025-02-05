import { createZodDto } from 'nestjs-zod';
import { PostCreateCommand } from 'libs/contracts/commands/post/create.command';

export class PostCreateDtoApi extends createZodDto(PostCreateCommand.RequestSchema) {}
