import { z } from 'zod';
export const TablesEnum = z.enum(['users', 'blogs', 'posts', 'comments', 'likes']);
