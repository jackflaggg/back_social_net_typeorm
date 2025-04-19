import { z } from 'zod';

export const TablesEnum = z.enum([
    'users',
    'email_confirmation_to_user',
    'blogs',
    'posts',
    'comments',
    'statuses_posts',
    'statuses_comments',
    'security_device_to_user',
    'recovery_password_to_user',
]);
export type TablesEnumType = z.infer<typeof TablesEnum>;
