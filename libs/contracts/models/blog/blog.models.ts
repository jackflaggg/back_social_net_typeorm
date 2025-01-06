import { z } from 'zod';
import { DeletionStatus } from '../../enums/deletion-status.enum';
import { nameConstraints } from '../../constants/blog/blog-property.constraints';

export const BlogModels = z.object({
    id: z.string(),
    name: z.string().min(nameConstraints.minLength).max(nameConstraints.maxLength),
    description: z.string(),
    websiteUrl: z.string().url('Invalid URL'),
    createdAt: z.date(),
    isMembership: z.boolean().default(false),
    deletionStatus: DeletionStatus,
});
