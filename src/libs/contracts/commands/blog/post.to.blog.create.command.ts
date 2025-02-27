import { z } from 'zod';
import { PostModel, trimString } from '../../models/post/post.model';
import { contentConstraints, shortDescriptionConstraints, titleConstraints } from '../../constants/post/post-property.constraints';

const PostToBlogCreateRequestSchema = z.object({
    title: z.string().trim().min(titleConstraints.minLength).max(titleConstraints.maxLength).transform(trimString),
    shortDescription: z
        .string()
        .min(shortDescriptionConstraints.minLength)
        .max(shortDescriptionConstraints.maxLength)
        .transform(trimString),
    content: z.string().trim().min(contentConstraints.minLength).max(contentConstraints.maxLength).transform(trimString),
});

export namespace PostToBlogCreateCommand {
    export const RequestSchema = PostToBlogCreateRequestSchema;
    export type Request = z.infer<typeof RequestSchema>;

    export const ResponseSchema = PostModel;
    export type Response = z.infer<typeof ResponseSchema>;
}
