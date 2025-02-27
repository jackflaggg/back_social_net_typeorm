import { z } from 'zod';
import { StatusLike } from '../../enums/status.like';
import { contentConstraints, shortDescriptionConstraints, titleConstraints } from '../../constants/post/post-property.constraints';

export const trimString = (str: string) => str.trim();

export const PostModel = z.object({
    id: z
        .string()
        .refine(str => str.length > 0, { message: 'ID cannot be empty' })
        .transform(trimString),
    title: z.string().min(titleConstraints.minLength).max(titleConstraints.maxLength).transform(trimString),
    shortDescription: z
        .string()
        .min(shortDescriptionConstraints.minLength)
        .max(shortDescriptionConstraints.maxLength)
        .transform(trimString),
    content: z.string().min(contentConstraints.minLength).max(contentConstraints.maxLength).transform(trimString),
    blogId: z.string().transform(trimString),
    blogName: z.string().transform(trimString),
    createdAt: z
        .string()
        .refine(str => !isNaN(Date.parse(str)), {
            message: 'Invalid date format',
        })
        .transform(trimString),
    extendedLikesInfo: z.object({
        likesCount: z.number().default(0),
        dislikesCount: z.number().default(0),
        myStatus: StatusLike.default('None'),
        newestLikes: z.array(
            z.object({
                addedAt: z
                    .string()
                    .refine(str => !isNaN(Date.parse(str)), {
                        message: 'Invalid date format',
                    })
                    .transform(trimString),
                userId: z.string().transform(trimString),
                login: z.string().transform(trimString),
            }),
        ),
    }),
});
