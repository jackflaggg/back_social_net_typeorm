import { z } from 'zod';

export const configSchema = z.object({
    DATABASE_URL: z.string(),
    APP_PORT: z
        .string()
        .default('3000')
        .transform(port => parseInt(port, 10)),
    API_PREFIX: z.string().default('api'),
    ACCESS_ID: z.string(),
    ACCESS_TOKEN_JWT_SECRET: z.string(),
    REFRESH_TOKEN_JWT_SECRET: z.string(),
    SECRET_KEY: z.string(),
    BUCKET_NAME: z.string(),
    ACCESS_TOKEN_EXPIRATION: z.string().default('3600'),
    REFRESH_TOKEN_EXPIRATION: z.string().default('86400'),
    RUSENDER_API_KEY: z.string(),
});

export type ConfigSchema = z.infer<typeof configSchema>;
