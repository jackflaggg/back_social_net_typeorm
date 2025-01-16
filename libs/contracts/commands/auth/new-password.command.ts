import { z } from 'zod';
import { passwordConstraints } from '../../constants/auth/auth-property.constraints';

const NewPasswordRequestSchema = z.object({
    newPassword: z.string().min(passwordConstraints.minLength).max(passwordConstraints.maxLength),
    recoveryCode: z.string(),
});

export namespace NewPasswordCommand {
    export const RequestSchema = NewPasswordRequestSchema;
    export type Request = z.infer<typeof RequestSchema>;
}
