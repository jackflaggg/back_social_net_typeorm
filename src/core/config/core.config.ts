import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { configSchema } from './config.schema';

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
    public adminUsername: string;
    public adminPassword: string;
    public adminEmail: string;
    public adminEmailPassword: string;
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
            adminUsername: this.configService.get('ADMIN_USERNAME'),
            adminPassword: this.configService.get('ADMIN_PASS'),
            adminEmail: this.configService.get('ADMIN_EMAIL'),
            adminEmailPassword: this.configService.get('ADMIN_EMAIL_PASSWORD'),
        };

        try {
            const validatedConfig = configSchema.parse(config);
            Object.assign(this, validatedConfig);
        } catch (error) {
            throw new Error('Ошибка валидации: ' + error.message);
        }
    }
}
