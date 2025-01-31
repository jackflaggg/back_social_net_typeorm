import { z } from 'zod';
import { StatusLike } from '../../enums/status.like';

const PostLikeRequestSchema = z.object({
    likeStatus: StatusLike,
});

export namespace PostLikeCommand {
    export const RequestSchema = PostLikeRequestSchema;
    export type Request = z.infer<typeof RequestSchema>;
}
