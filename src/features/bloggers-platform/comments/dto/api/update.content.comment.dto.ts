import { CommentCreateCommand } from 'libs/contracts/commands/comment/create.command';
import { createZodDto } from 'nestjs-zod';

export class UpdateCommentApiDto extends createZodDto(CommentCreateCommand.RequestSchema) {}
