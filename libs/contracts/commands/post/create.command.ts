import { z } from 'zod';
import { PostModels, trimString } from '../../models/post/post.models';
import { shortDescriptionConstraints, titleConstraints } from '../../constants/post/post-property.constraints';
import * as mongoose from 'mongoose';

const PostCreateRequestSchema = z.object({
    title: z.string().trim().min(titleConstraints.minLength).max(titleConstraints.maxLength).transform(trimString),
    shortDescription: z
        .string()
        .trim()
        .min(shortDescriptionConstraints.minLength)
        .max(shortDescriptionConstraints.maxLength)
        .transform(trimString),
    content: z.string().trim().max(1000).transform(trimString),
    blogId: z.string().refine(value => mongoose.Types.ObjectId.isValid(value)),
});

export namespace PostCreateCommand {
    export const RequestSchema = PostCreateRequestSchema;
    export type Request = z.infer<typeof RequestSchema>;

    export const ResponseSchema = PostModels;
    export type Response = z.infer<typeof ResponseSchema>;
}
