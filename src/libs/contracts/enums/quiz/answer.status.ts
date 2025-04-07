import { z } from 'zod';

export const AnswerStatus = z.enum(['Correct', 'Incorrect']);
export type AnswerStatusType = z.infer<typeof AnswerStatus>;
