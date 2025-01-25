import { z } from 'zod';
import { trimString } from '../../models/post/post.models';
import { contentConstraints } from '../../constants/comment/comment-property.constraints';

const CommentUpdateContentRequestSchema = z.object({
    content: z.string().min(contentConstraints.minLength).max(contentConstraints.maxLength).transform(trimString),
});

export namespace CommentUpdateCommand {
    export const RequestSchema = CommentUpdateContentRequestSchema;
    export type Request = z.infer<typeof RequestSchema>;
}
