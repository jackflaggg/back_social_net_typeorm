import { z } from 'zod';

export const blogSortBy = z.enum(['createdAt', 'name', 'description', 'websiteUrl']);
export type BlogSortByEnum = z.infer<typeof blogSortBy>;
export const BlogSortByValues = blogSortBy.options; // ['createdAt', 'name', 'description', 'websiteUrl']
