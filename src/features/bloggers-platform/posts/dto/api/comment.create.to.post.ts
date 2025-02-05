import { createZodDto } from 'nestjs-zod';
import { CommentCreateCommand } from 'libs/contracts/commands/comment/create.command';

export class CommentCreateToPostApi extends createZodDto(CommentCreateCommand.RequestSchema) {}
