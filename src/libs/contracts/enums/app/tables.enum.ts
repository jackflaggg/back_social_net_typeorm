import { z } from 'zod';

export const TablesEnum = z.enum([
    'users',
    'blogs',
    'posts',
    'comments',
    'statuses_posts',
    'statuses_comments',
    'email_confirmation_to_user',
    'security_device_to_user',
    'recovery_password_to_user',
]);
export type TablesEnumType = z.infer<typeof TablesEnum>;
