import { z } from 'zod';

export const entitiesSortBy = z.enum([
    'createdAt',
    'title',
    'shortDescription',
    'content',
    'blogId',
    'blogName',
    'id',
    'login',
    'email',
    'websiteUrl',
    'name',
    'description',
]);
export type EntitiesSortByEnum = z.infer<typeof entitiesSortBy>;
export const PostSortByValues = entitiesSortBy.options;
