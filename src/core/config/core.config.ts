import { ConfigModule, ConfigService } from '@nestjs/config';
import process from 'node:process';
import { configValidationUtility } from '../utils/config-validation.utility';
import { z } from 'zod';
import { ZodEnvironments } from '@libs/contracts/enums/enviroments';

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

const configSchema = z.object({
    port: z.string().transform(val => {
        const numVal = Number(val);
        if (isNaN(numVal)) {
            throw new Error('Установите переменную окружения PORT, например: 9000');
        }
        return numVal;
    }),
    mongoUrl: z.string().nonempty('Установите переменную окружения MONGO_URI, например: mongodb://localhost:27017/my-app-local-db'),
    dbName: z.string().nonempty('Установите переменную окружения DB_NAME, например: my-app-local-db'),
    dbHost: z.string().nonempty('Установите переменную окружения DB_HOST, например: localhost'),
    dbPort: z.string().transform(val => {
        const numVal = Number(val);
        if (isNaN(numVal)) {
            throw new Error('Установите переменную окружения DB_PORT, например: 5432');
        }
        return numVal;
    }),
    dbUsername: z.string().nonempty('Установите переменную окружения DB_USERNAME, например: admin'),
    dbPassword: z.string().nonempty('Установите переменную окружения DB_PASSWORD, например: admin'),
    env: ZodEnvironments,
    isSwaggerEnabled: z.string().transform(val => {
        const booleanValue = configValidationUtility.convertToBoolean(val);
        if (booleanValue === null) {
            throw new Error(
                'Установите переменную окружения IS_SWAGGER_ENABLED для включения/отключения Swagger, например: true, доступные значения: true, false',
            );
        }
        return booleanValue;
    }),
    includeTestingModule: z.string().transform(val => {
        const booleanValue = configValidationUtility.convertToBoolean(val);
        if (booleanValue === null) {
            throw new Error(
                'Установите переменную окружения INCLUDE_TESTING_MODULE для включения/отключения опасного для продакшена TestingModule, например: true, доступные значения: true, false, 0, 1',
            );
        }
        return booleanValue;
    }),
    refreshTokenSecret: z.string().nonempty('Установите переменную окружения JWT_REFRESH_SECRET, это опасно для безопасности!'),
    accessTokenSecret: z.string().nonempty('Установите переменную окружения JWT_ACCESS_SECRET, это опасно для безопасности!'),
    accessTokenExpirationTime: z
        .string()
        .nonempty('Установите переменную окружения JWT_ACCESS_EXPIRATION_TIME, это опасно для безопасности!'),
    refreshTokenExpirationTime: z
        .string()
        .nonempty('Установите переменную окружения JWT_REFRESH_EXPIRATION_TIME, это опасно для безопасности!'),
});

export class CoreConfig {
    constructor(private configService: ConfigService<any, true>) {
        const config = {
            port: this.configService.get('PORT'),
            mongoUrl: this.configService.get('MONGO_URL'),
            dbName: this.configService.get('DB_NAME'),
            dbHost: this.configService.get('DB_HOST'),
            dbPort: this.configService.get('DB_PORT'),
            dbUsername: this.configService.get('DB_USERNAME'),
            dbPassword: this.configService.get('DB_PASSWORD'),
            env: this.configService.get('NODE_ENV'),
            isSwaggerEnabled: this.configService.get('IS_SWAGGER_ENABLED'),
            includeTestingModule: this.configService.get('INCLUDE_TESTING_MODULE'),
            refreshTokenSecret: this.configService.get('JWT_REFRESH_SECRET'),
            accessTokenSecret: this.configService.get('JWT_ACCESS_SECRET'),
            accessTokenExpirationTime: this.configService.get('JWT_ACCESS_EXPIRATION_TIME'),
            refreshTokenExpirationTime: this.configService.get('JWT_REFRESH_EXPIRATION_TIME'),
        };

        try {
            const validatedConfig = configSchema.parse(config);
            Object.assign(this, validatedConfig);
        } catch (error) {
            throw new Error('Ошибка валидации: ' + error.message);
        }
    }
}
