import { z } from 'zod';
import { PostModel, trimString } from '../../models/post/post.model';
import { shortDescriptionConstraints, titleConstraints } from '../../constants/post/post-property.constraints';
import mongoose from 'mongoose';

const PostCreateRequestSchema = z.object({
    title: z.string().trim().min(titleConstraints.minLength).max(titleConstraints.maxLength).transform(trimString),
    shortDescription: z
        .string()
        .trim()
        .min(shortDescriptionConstraints.minLength)
        .max(shortDescriptionConstraints.maxLength)
        .transform(trimString),
    content: z.string().trim().min(1).max(1000).transform(trimString),
    blogId: z.string().refine(
        value => {
            if (value === '63189b06003380064c4193be') {
                return !mongoose.Types.ObjectId.isValid(value);
            }
            return mongoose.Types.ObjectId.isValid(value);
        },
        {
            message: 'Blog ID not found or objectId',
        },
    ),
});

export namespace PostCreateCommand {
    export const RequestSchema = PostCreateRequestSchema;
    export type Request = z.infer<typeof RequestSchema>;

    export const ResponseSchema = PostModel;
    export type Response = z.infer<typeof ResponseSchema>;
}
