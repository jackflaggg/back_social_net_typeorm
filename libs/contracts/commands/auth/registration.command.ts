import { z } from 'zod';
import { loginConstraints } from '../../constants/user/user-property.constraints';
import { passwordConstraints } from '../../constants/auth/auth-property.constraints';

const RegistrationSchema = z.object({
    login: z.string().regex(new RegExp('^[a-zA-Z0-9_-]*$')).min(loginConstraints.minLength).max(loginConstraints.maxLength),
    password: z.string().min(passwordConstraints.minLength).max(passwordConstraints.maxLength),
    email: z.string().email(),
});

export namespace RegistrationCommand {
    export const RequestSchema = RegistrationSchema;
    export type Request = z.infer<typeof RequestSchema>;
}
