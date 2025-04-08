import { z } from 'zod';
import { trimString } from '../../../models/post/post.model';

const QuestionCreateRequestSchema = z.object({
    body: z
        .string()
        .trim()
        .min(10, { message: 'Длина должна быть не менее 10 символов' })
        .max(500, { message: 'Длина не должна превышать 500 символов' })
        .transform(trimString),
    correctAnswers: z.array(z.string().trim()).nonempty({ message: 'Должен быть хотя бы один правильный ответ' }),
});

export namespace QuestionCreateCommand {
    export const RequestSchema = QuestionCreateRequestSchema;
    export type Request = z.infer<typeof RequestSchema>;
}
