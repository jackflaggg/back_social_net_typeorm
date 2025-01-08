import { z } from 'zod';
import { trimString } from '../../models/post/post.models';
import { UserModels } from '../../models/user/user.models';
import { loginConstraints, passwordConstraints } from '../../constants/user/user-property.constraints';
import { emailRegexp } from '../../constants/user/email.regexp';

const UserCreateRequestSchema = z.object({
    login: z.string().min(loginConstraints.minLength).max(loginConstraints.maxLength).transform(trimString),
    password: z.string().min(passwordConstraints.minLength).max(passwordConstraints.maxLength).transform(trimString),
    email: z
        .string()
        .transform(trimString)
        .refine(email => emailRegexp.test(email)),
});

export namespace UserCreateCommand {
    export const RequestSchema = UserCreateRequestSchema;
    export type Request = z.infer<typeof RequestSchema>;

    export const ResponseSchema = UserModels.omit({ password: true });
    export type Response = z.infer<typeof ResponseSchema>;
}
