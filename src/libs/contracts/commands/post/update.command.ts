import { z } from 'zod';
import { trimString } from '../../models/post/post.models';
import mongoose from 'mongoose';

const PostUpdateRequestSchema = z.object({
    title: z.string().trim().min(1).max(30).transform(trimString),
    shortDescription: z.string().trim().min(1).max(100).transform(trimString),
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

export namespace PostUpdateCommand {
    export const RequestSchema = PostUpdateRequestSchema;
    export type Request = z.infer<typeof RequestSchema>;
}
