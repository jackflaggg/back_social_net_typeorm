import { z } from 'zod';

const RegistrationEmailResendingSchema = z.object({
    email: z
        .string()
        .email()
        .transform(value => value.trim()),
});

export namespace RegistrationEmailResendingCommand {
    export const RequestSchema = RegistrationEmailResendingSchema;
    export type Request = z.infer<typeof RequestSchema>;
}
