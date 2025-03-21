import { z } from 'zod';
import { descriptionConstraints, nameConstraints } from '../../constants/blog/blog-property.constraints';
import { BlogModels } from '../../models/blog/blog.model';
import { trimString } from '../../models/post/post.model';

const BlogCreateRequestSchema = z.object({
    name: z.string().trim().min(nameConstraints.minLength).max(nameConstraints.maxLength),
    description: z.string().max(descriptionConstraints.maxLength).transform(trimString),
    websiteUrl: z.string().url('невалидный URL').max(100).transform(trimString),
});

const BlogCreateResponseSchema = BlogModels.omit({ deletionStatus: true });

export namespace BlogCreateCommand {
    export const RequestSchema = BlogCreateRequestSchema;
    export type Request = z.infer<typeof RequestSchema>;

    export const ResponseSchema = BlogCreateResponseSchema;
    export type Response = z.infer<typeof ResponseSchema>;
}
