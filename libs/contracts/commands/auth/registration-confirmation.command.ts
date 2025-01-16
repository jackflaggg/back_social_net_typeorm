import { z } from 'zod';

const RegistrationConfirmationSchema = z.object({
    code: z.string(),
});

export namespace RegistrationConfirmationCommand {
    export const RequestSchema = RegistrationConfirmationSchema;
    export type Request = z.infer<typeof RequestSchema>;
}
