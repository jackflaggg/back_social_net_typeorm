import { ConfigModule } from '@nestjs/config';
import process from 'node:process';
import { join } from 'path';

/**
 * Модуль для настройки конфигурации приложения.
 * Загружает переменные окружения из файлов .env с различным приоритетом.
 */
export const envModule = ConfigModule.forRoot({
    envFilePath: [
        // высокий приоритет
        ...(process.env.ENV_FILE_PATH ? [process.env.ENV_FILE_PATH.trim()] : []),
        // низкий приоритет
        join(__dirname, `../.env`),
        // низкий приоритет
        join(__dirname, `./env/.env.${process.env.NODE_ENV}`),
        // низкий приоритет
        join(__dirname, './env/.env.production'),
        // низкий приоритет
        join(__dirname, './env/.env.testing'),
    ],
    isGlobal: true,
});
