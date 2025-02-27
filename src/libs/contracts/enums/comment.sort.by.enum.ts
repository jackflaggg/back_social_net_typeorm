import { z } from 'zod';

export const commentSortBy = z.enum(['createdAt', 'content']);
export type CommentSortByEnum = z.infer<typeof commentSortBy>;
export const CommentSortByValues = commentSortBy.options;
