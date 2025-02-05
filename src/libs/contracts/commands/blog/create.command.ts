import { z } from 'zod';
import { nameConstraints } from '../../constants/blog/blog-property.constraints';
import { BlogModels } from '../../models/blog/blog.models';
import { trimString } from '../../models/post/post.models';

const BlogCreateRequestSchema = z.object({
    name: z.string().trim().min(nameConstraints.minLength).max(nameConstraints.maxLength),
    description: z.string().max(500).transform(trimString),
    websiteUrl: z.string().url('Invalid URL').max(100).transform(trimString),
});

const BlogCreateResponseSchema = BlogModels.omit({ deletionStatus: true });

export namespace BlogCreateCommand {
    export const RequestSchema = BlogCreateRequestSchema;
    export type Request = z.infer<typeof RequestSchema>;

    export const ResponseSchema = BlogCreateResponseSchema;
    export type Response = z.infer<typeof ResponseSchema>;
}
