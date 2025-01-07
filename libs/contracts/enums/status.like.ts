import { z } from 'zod';

export const StatusLike = z.enum(['None', 'Like', 'Dislike']);
