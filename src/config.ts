import { ConfigModule } from '@nestjs/config';

export const configModule = ConfigModule.forRoot({
    envFilePath: [
        // у первого файлика приоритет выше!
        '.env.production'.trim() || '.env.development'.trim(),
        '.env.development',
    ],
});
