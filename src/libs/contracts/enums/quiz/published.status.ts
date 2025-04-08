import { z } from 'zod';

export const publishedStatus = z.enum(['all', 'published', 'notPublished']);
export type publishedStatusByEnum = z.infer<typeof publishedStatus>;
export const publishedStatusByValues = publishedStatus.options; // ['createdAt', 'name', 'description', 'websiteUrl']
