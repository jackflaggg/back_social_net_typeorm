import { ConfigService } from '@nestjs/config';
import { configValidationUtility } from '../utils/config-validation.utility';
import { z } from 'zod';
import { ZodEnvironments } from '@libs/contracts/enums/enviroments';
import { Injectable } from '@nestjs/common';

const configSchema = z.object({
    port: z.string().transform(val => {
        const numVal = Number(val);
        if (isNaN(numVal)) {
            throw new Error('Установите переменную окружения PORT, например: 9000');
        }
        return numVal;
    }),
    mongoUrl: z.string().nonempty('Установите переменную окружения MONGO_URI, например: mongodb://localhost:27017/my-app-local-db'),
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

@Injectable()
export class CoreConfig {
    public port: number;
    public mongoUrl: string;
    public env: string;
    public isSwaggerEnabled: boolean;
    public includeTestingModule: boolean;
    public refreshTokenSecret: string;
    public accessTokenSecret: string;
    public accessTokenExpirationTime: string;
    public refreshTokenExpirationTime: string;
    constructor(private configService: ConfigService<any, true>) {
        const config = {
            port: this.configService.get('PORT'),
            mongoUrl: this.configService.get('MONGO_URI'),
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
