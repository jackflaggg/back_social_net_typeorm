import { z } from 'zod';
import { loginConstraints } from '../../constants/user/user-property.constraints';
import { passwordConstraints } from '../../constants/auth/auth-property.constraints';
import * as mongoose from 'mongoose';
import { UserEntity } from '../../../../src/features/user-accounts/domain/user/user.entity';

const RegistrationSchema = z.object({
    login: z
        .string()
        .regex(new RegExp('^[a-zA-Z0-9_-]*$'))
        .min(loginConstraints.minLength)
        .max(loginConstraints.maxLength)
        .refine(async (value: any) => {
            const count = await mongoose.model(UserEntity.name).countDocuments({ login: value });
            return count < 1;
        }),
    password: z.string().min(passwordConstraints.minLength).max(passwordConstraints.maxLength),
    email: z
        .string()
        .email()
        .refine(async (value: any) => {
            const count = await mongoose.model(UserEntity.name).countDocuments({ email: value });
            return count < 1;
        }),
});

export namespace RegistrationCommand {
    export const RequestSchema = RegistrationSchema;
    export type Request = z.infer<typeof RequestSchema>;
}
