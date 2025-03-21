import { z } from 'zod';

export const DeletionStatus = z.enum(['not-deleted', 'permanent-deleted']);
export type DeletionStatusType = z.infer<typeof DeletionStatus>;
