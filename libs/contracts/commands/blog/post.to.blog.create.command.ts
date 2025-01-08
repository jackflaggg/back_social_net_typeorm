import { z } from 'zod';
import { PostModels, trimString } from '../../models/post/post.models';
import { contentConstraints, shortDescriptionConstraints, titleConstraints } from '../../constants/post/post-property.constraints';

const PostToBlogCreateRequestSchema = z.object({
    title: z.string().min(titleConstraints.minLength).max(titleConstraints.maxLength).transform(trimString),
    shortDescription: z
        .string()
        .min(shortDescriptionConstraints.minLength)
        .max(shortDescriptionConstraints.maxLength)
        .transform(trimString),
    content: z.string().min(contentConstraints.minLength).max(contentConstraints.maxLength).transform(trimString),
});

export namespace PostToBlogCreateCommand {
    export const RequestSchema = PostToBlogCreateRequestSchema;
    export type Request = z.infer<typeof RequestSchema>;

    export const ResponseSchema = PostModels;
    export type Response = z.infer<typeof ResponseSchema>;
}
