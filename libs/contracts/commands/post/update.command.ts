import { z } from 'zod';
import { nameConstraints } from '../../constants/blog/blog-property.constraints';
import { trimString } from '../../models/post/post.models';

const PostUpdateRequestSchema = z.object({
    title: z.string().min(nameConstraints.minLength).max(nameConstraints.maxLength).transform(trimString),
    shortDescription: z.string().transform(trimString),
    content: z.string().url('Invalid URL').transform(trimString),
    blogId: z.string().transform(trimString),
});

export namespace PostUpdateCommand {
    export const RequestSchema = PostUpdateRequestSchema;
    export type Request = z.infer<typeof RequestSchema>;
}
