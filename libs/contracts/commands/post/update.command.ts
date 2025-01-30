import { z } from 'zod';
import { trimString } from '../../models/post/post.models';

const PostUpdateRequestSchema = z.object({
    title: z.string().trim().max(30).transform(trimString),
    shortDescription: z.string().trim().max(100).transform(trimString),
    content: z.string().trim().max(1000).transform(trimString),
    blogId: z.string().transform(trimString),
});

export namespace PostUpdateCommand {
    export const RequestSchema = PostUpdateRequestSchema;
    export type Request = z.infer<typeof RequestSchema>;
}
