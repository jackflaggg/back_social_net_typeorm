import { z } from 'zod';
import { nameConstraints } from '../../constants/blog/blog-property.constraints';

const BlogUpdateRequestSchema = z.object({
    name: z.string().min(nameConstraints.minLength).max(nameConstraints.maxLength),
    description: z.string(),
    websiteUrl: z.string().url('Invalid URL'),
});

export namespace BlogUpdateCommand {
    export const RequestSchema = BlogUpdateRequestSchema;
    export type Request = z.infer<typeof RequestSchema>;
}
