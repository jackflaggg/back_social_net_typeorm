import { z } from 'zod';
import { DeletionStatus } from '../../enums/deletion-status.enum';
import { nameConstraints } from '../../constants/blog/blog-property.constraints';
import { trimString } from '../post/post.model';

export const BlogModels = z.object({
    id: z.string().transform(trimString),
    name: z.string().min(nameConstraints.minLength).max(nameConstraints.maxLength).transform(trimString),
    description: z.string().transform(trimString),
    websiteUrl: z.string().url('Invalid URL').transform(trimString),
    createdAt: z.string().date().transform(trimString),
    isMembership: z.boolean().default(false),
    deletionStatus: DeletionStatus,
});
