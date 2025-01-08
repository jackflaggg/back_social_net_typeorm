import { z } from 'zod';
import { trimString } from '../post/post.models';
import { loginConstraints, passwordConstraints } from '../../constants/user/user-property.constraints';
import { emailRegexp } from '../../constants/user/email.regexp';

export const UserModels = z.object({
    id: z
        .string()
        .refine(str => str.length > 0, { message: 'ID cannot be empty' })
        .transform(trimString),
    login: z.string().min(loginConstraints.minLength).max(loginConstraints.maxLength).transform(trimString),
    password: z.string().min(passwordConstraints.minLength).max(passwordConstraints.maxLength).transform(trimString),
    email: z
        .string()
        .transform(trimString)
        .refine(email => emailRegexp.test(email), {
            message: 'Invalid email format',
        }),
    createdAt: z
        .string()
        .refine(str => !isNaN(Date.parse(str)), {
            message: 'Invalid date format',
        })
        .transform(trimString),
});
