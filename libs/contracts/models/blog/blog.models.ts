import { z } from 'zod';
import { DeletionStatus } from '../../enums/deletion-status.enum';
import { nameConstraints } from '../../constants/blog/blog-property.constraints';

export const BlogModels = z.object({
    id: z.string().trim(),
    name: z.string().trim().min(nameConstraints.minLength).max(nameConstraints.maxLength),
    description: z.string().trim(),
    websiteUrl: z.string().trim().url('Invalid URL'),
    createdAt: z.string().date().trim(),
    isMembership: z.boolean().default(false),
    deletionStatus: DeletionStatus,
});
