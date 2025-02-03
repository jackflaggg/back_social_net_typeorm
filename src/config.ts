import { ConfigModule } from '@nestjs/config';
import process from 'node:process';

export const configModule = ConfigModule.forRoot({
    envFilePath: [
        // у первого файлика приоритет выше!
        `.env.${process.env.NODE_ENV}.local`,
        `.env.${process.env.NODE_ENV}`,
        '.env.production',
        '.env.development',
    ],
    isGlobal: true,
});
