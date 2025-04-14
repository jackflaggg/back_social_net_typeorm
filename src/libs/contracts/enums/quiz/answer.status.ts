import { z } from 'zod';

export const AnswerStatus = z.enum(['correct', 'incorrect']);
export type AnswerStatusType = z.infer<typeof AnswerStatus>;
