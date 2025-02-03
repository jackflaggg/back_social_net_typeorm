import { z } from 'zod';

export const ZodEnvironments = z.enum(['development', 'production', 'testing']);
