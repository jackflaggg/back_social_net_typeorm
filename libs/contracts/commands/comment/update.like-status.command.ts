import { z } from 'zod';
import { StatusLike } from '../../enums/status.like';

const CommentUpdateStatusRequestSchema = z.object({
    likeStatus: StatusLike,
});

export namespace CommentUpdateStatusesCommand {
    export const RequestSchema = CommentUpdateStatusRequestSchema;
    export type Request = z.infer<typeof RequestSchema>;
}
