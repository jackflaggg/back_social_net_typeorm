import { z } from 'zod';
import { trimString } from '../../models/post/post.model';

const PostUpdateRequestSchema = z.object({
    title: z.string().trim().min(1).max(30).transform(trimString),
    shortDescription: z.string().trim().min(1).max(100).transform(trimString),
    content: z.string().trim().min(1).max(1000).transform(trimString),
});

export namespace PostUpdateCommand {
    export const RequestSchema = PostUpdateRequestSchema;
    export type Request = z.infer<typeof RequestSchema>;
}
