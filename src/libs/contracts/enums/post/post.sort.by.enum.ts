import { z } from 'zod';

export const postSortBy = z.enum(['createdAt', 'title', 'shortDescription', 'content', 'blogId', 'blogName']);
export type PostSortByEnum = z.infer<typeof postSortBy>;
export const PostSortByValues = postSortBy.options;
