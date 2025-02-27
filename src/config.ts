import { ConfigModule } from '@nestjs/config';
import process from 'node:process';
import { join } from 'path';

export const configModule = ConfigModule.forRoot({
    envFilePath: [
        // высокий приоритет
        ...(process.env.ENV_FILE_PATH ? [process.env.ENV_FILE_PATH.trim()] : []),
        // низкий приоритет
        join(__dirname, `../.env`),
        // низкий приоритет
        join(__dirname, `./env/.env.${process.env.NODE_ENV}`),
        // низкий приоритет
        join(__dirname, './env/.env.production'),
    ],
    isGlobal: true,
});
