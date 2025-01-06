import { z } from 'zod';
export const DeletionStatus = z.enum(['not-deleted', 'permanent-deleted']);
