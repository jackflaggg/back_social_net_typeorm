import { z } from 'zod';
import { passwordConstraints } from '../../constants/auth/auth-property.constraints';
import { emailRegexp } from '../../constants/user/email.regexp';

export const RegistrationSchema = z.object({
    login: z.string().transform(value => value.trim()),
    password: z
        .string()
        .min(passwordConstraints.minLength)
        .max(passwordConstraints.maxLength)
        .transform(value => value.trim()),
    email: z
        .string()
        .regex(emailRegexp)
        .transform(value => value.trim()),
});

export namespace RegistrationCommand {
    export const RequestSchema = RegistrationSchema;
    export type Request = z.infer<typeof RequestSchema>;
}
