import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { configSchema } from './config.schema';

/**
 * Сервис для хранения конфигурации приложения.
 * Загружает настройки из переменных окружения и предоставляет доступ к ним.
 */
@Injectable()
export class AppConfig {
    public port: number;
    public env: string;
    public refreshTokenSecret: string;
    public accessTokenSecret: string;
    public accessTokenExpirationTime: string;
    public refreshTokenExpirationTime: string;
    public adminUsername: string;
    public adminPassword: string;
    public adminEmail: string;
    public adminEmailPassword: string;

    public typeSql: string;
    public hostSql: string;
    public portSql: number;
    public usernameSql: string;
    public passwordSql: string;
    public databaseNameSql: string;

    // public testUrl: string;
    // public isSwaggerEnabled: boolean;
    // public includeTestingModule: boolean;

    constructor(private configService: ConfigService<Record<string, unknown>, true>) {
        const config = {
            port: this.configService.get('PORT'),
            env: this.configService.get('NODE_ENV'),
            refreshTokenSecret: this.configService.get('JWT_REFRESH_SECRET'),
            accessTokenSecret: this.configService.get('JWT_ACCESS_SECRET'),
            accessTokenExpirationTime: this.configService.get('JWT_ACCESS_EXPIRATION_TIME'),
            refreshTokenExpirationTime: this.configService.get('JWT_REFRESH_EXPIRATION_TIME'),
            adminUsername: this.configService.get('ADMIN_USERNAME'),
            adminPassword: this.configService.get('ADMIN_PASS'),
            adminEmail: this.configService.get('ADMIN_EMAIL'),
            adminEmailPassword: this.configService.get('ADMIN_EMAIL_PASSWORD'),

            typeSql: this.configService.get('TYPE_SQL'),
            hostSql: this.configService.get('HOST_SQL'),
            portSql: this.configService.get('PORT_SQL'),
            usernameSql: this.configService.get('USERNAME_SQL'),
            passwordSql: this.configService.get('PASSWORD_SQL'),
            databaseNameSql: this.configService.get('DATABASE_NAME_SQL'),

            // isSwaggerEnabled: this.configService.get('IS_SWAGGER_ENABLED'),
            // includeTestingModule: this.configService.get('INCLUDE_TESTING_MODULE'),
            // mongoUrl: this.configService.get('MONGO_URI'),
            // testUrl: this.configService.get('DB_URI_TEST'),
        };

        try {
            const validatedConfig = configSchema.parse(config);
            Object.assign(this, validatedConfig);
        } catch (error) {
            throw new Error('Ошибка валидации: ' + error.message);
        }
    }
}
