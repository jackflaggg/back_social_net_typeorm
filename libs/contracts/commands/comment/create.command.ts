import { z } from 'zod';
import { contentConstraints } from '../../constants/comment/comment-property.constraints';
import { trimString } from '../../models/post/post.models';
import { CommentModels } from '../../models/comment/comment.model';

const CommentCreateRequestSchema = z.object({
    content: z.string().trim().min(contentConstraints.minLength).max(contentConstraints.maxLength).transform(trimString),
});

export namespace CommentCreateCommand {
    export const RequestSchema = CommentCreateRequestSchema;
    export type Request = z.infer<typeof RequestSchema>;

    export const ResponseSchema = CommentModels;
    export type Response = z.infer<typeof ResponseSchema>;
}
