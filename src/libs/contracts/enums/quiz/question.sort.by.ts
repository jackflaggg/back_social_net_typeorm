import { z } from 'zod';

export const questionSortBy = z.enum(['createdAt', 'body', 'published', 'updatedAt']);
export type questionSortByEnum = z.infer<typeof questionSortBy>;
export const questionSortByValues = questionSortBy.options;
