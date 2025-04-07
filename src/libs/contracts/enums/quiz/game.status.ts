import { z } from 'zod';

export const GameStatus = z.enum(['PendingSecondPlayer', 'Active', 'Finished']);
export type GameStatusType = z.infer<typeof GameStatus>;
