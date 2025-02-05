import { createZodDto } from 'nestjs-zod';
import { CommentCreateCommand } from '../../../../../libs/contracts/commands/comment/create.command';

export class UpdateCommentApiDto extends createZodDto(CommentCreateCommand.RequestSchema) {}
