import { CommentUpdateStatusesCommand } from '@libs/contracts/commands/comment/update.like-status.command';
import { createZodDto } from 'nestjs-zod';

export class UpdateCommentCommandApiDto extends createZodDto(CommentUpdateStatusesCommand.RequestSchema) {}
