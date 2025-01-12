import { z } from 'zod';
import { trimString } from '../post/post.models';
import { contentConstraints } from '../../constants/comment/comment-property.constraints';

export const CommentModels = z.object({
    id: z.string().transform(trimString),
    content: z.string().min(contentConstraints.minLength).max(contentConstraints.maxLength),
    commentatorInfo: z.object({
        userId: z.string().transform(trimString),
        userLogin: z.string().transform(trimString),
    }),
    createdAt: z.date(),
    postId: z.string(),
    likesCount: z.string(),
    dislikesCount: z.string(),
});
