import { ConfigModule } from '@nestjs/config';
import process from 'node:process';
import { join } from 'path';

export const configModule = ConfigModule.forRoot({
    envFilePath: [
        // high priority
        ...(process.env.ENV_FILE_PATH ? [process.env.ENV_FILE_PATH.trim()] : []),
        // lower priority
        join(__dirname, `../.env`),
        // lower priority
        join(__dirname, `./env/.env.${process.env.NODE_ENV}`),
        // lower priority
        join(__dirname, './env/.env.production'),
    ],
    isGlobal: true,
});
