import { z } from 'zod';
import { passwordConstraints } from '../../constants/auth/auth-property.constraints';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const loginRegex = /^[a-zA-Z0-9.-]+$/;

const UserLoginRequestSchema = z.object({
    loginOrEmail: z
        .string()
        .refine((value: any) => {
            if (typeof value !== 'string' || value.trim() === '') {
                return false;
            }

            const trimmedValue = value.trim();

            if (trimmedValue.length < 3) {
                return false;
            }

            if (trimmedValue.includes('@')) {
                return emailRegex.test(trimmedValue);
            }

            return loginRegex.test(trimmedValue);
        })
        .transform(value => value.trim()),
    password: z
        .string()
        .min(passwordConstraints.minLength)
        .max(passwordConstraints.maxLength)
        .transform(value => value.trim()),
});

const UserLoginResponseSchema = z.object({
    accessToken: z.string(),
});

export namespace UserLoginCommand {
    export const RequestSchema = UserLoginRequestSchema;
    export type Request = z.infer<typeof RequestSchema>;

    export const ResponseSchema = UserLoginResponseSchema;
    export type Response = z.infer<typeof ResponseSchema>;
}
