import { z } from 'zod';
import { trimString } from '../../models/post/post.model';
import { UserModel } from '../../models/user/user.model';
import { loginConstraints, passwordConstraints } from '../../constants/user/user-property.constraints';
import { emailRegexp } from '../../constants/user/email.regexp';

const UserCreateRequestSchema = z.object({
    login: z.string().trim().min(loginConstraints.minLength).max(loginConstraints.maxLength),
    password: z.string().min(passwordConstraints.minLength).max(passwordConstraints.maxLength).transform(trimString),
    email: z
        .string()
        .transform(trimString)
        .refine(email => emailRegexp.test(email)),
});

export namespace UserCreateCommand {
    export const RequestSchema = UserCreateRequestSchema;
    export type Request = z.infer<typeof RequestSchema>;

    export const ResponseSchema = UserModel.omit({ password: true });
    export type Response = z.infer<typeof ResponseSchema>;
}
