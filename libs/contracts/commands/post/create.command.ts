import { z } from 'zod';
import { PostModels, trimString } from '../../models/post/post.models';
import { contentConstraints, shortDescriptionConstraints, titleConstraints } from '../../constants/post/post-property.constraints';

const PostCreateRequestSchema = z.object({
    title: z.string().min(titleConstraints.minLength).max(titleConstraints.maxLength).transform(trimString),
    shortDescription: z
        .string()
        .min(shortDescriptionConstraints.minLength)
        .max(shortDescriptionConstraints.maxLength)
        .transform(trimString),
    content: z.string().min(contentConstraints.minLength).max(contentConstraints.maxLength).transform(trimString),
    blogId: z.string().transform(trimString),
});

export namespace PostCreateCommand {
    export const RequestSchema = PostCreateRequestSchema;
    export type Request = z.infer<typeof RequestSchema>;

    export const ResponseSchema = PostModels;
    export type Response = z.infer<typeof ResponseSchema>;
}
