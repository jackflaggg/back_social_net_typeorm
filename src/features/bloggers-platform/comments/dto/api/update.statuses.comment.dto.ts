import { createZodDto } from 'nestjs-zod';
import { CommentUpdateStatusesCommand } from '../../../../../libs/contracts/commands/comment/update.like-status.command';

export class UpdateCommentCommandApiDto extends createZodDto(CommentUpdateStatusesCommand.RequestSchema) {}
