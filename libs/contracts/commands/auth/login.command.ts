import { z } from 'zod';

const UserLoginRequestSchema = z.object({
    //TODO#1: Сделать в зависимости от введенных данных!
    loginOrEmail: z.string(),
    password: z.string(),
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
