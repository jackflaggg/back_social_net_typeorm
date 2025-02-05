import { z } from 'zod';
import { nameConstraints } from '../../constants/blog/blog-property.constraints';
import { trimString } from '../../models/post/post.models';

const BlogUpdateRequestSchema = z.object({
    name: z.string().trim().min(nameConstraints.minLength).max(nameConstraints.maxLength),
    description: z.string().transform(trimString),
    websiteUrl: z.string().trim().url('Invalid URL').max(100).transform(trimString),
});

export namespace BlogUpdateCommand {
    export const RequestSchema = BlogUpdateRequestSchema;
    export type Request = z.infer<typeof RequestSchema>;
}
