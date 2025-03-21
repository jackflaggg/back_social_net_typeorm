import { z } from 'zod';
import { ZodEnvironments } from '../../libs/contracts/enums/app/enviroments';

export const configSchema = z.object({
    port: z.string().transform(val => {
        const numVal = Number(val);
        if (isNaN(numVal)) {
            throw new Error('Установите переменную окружения PORT, например: 9000');
        }
        return numVal;
    }),
    env: ZodEnvironments,
    refreshTokenSecret: z.string().nonempty('Установите переменную окружения JWT_REFRESH_SECRET'),
    accessTokenSecret: z.string().nonempty('Установите переменную окружения JWT_ACCESS_SECRET'),
    accessTokenExpirationTime: z.string().nonempty('Установите переменную окружения JWT_ACCESS_EXPIRATION_TIME'),
    refreshTokenExpirationTime: z.string().nonempty('Установите переменную окружения JWT_REFRESH_EXPIRATION_TIME'),
    adminUsername: z.string().nonempty('Установите переменную окружения ADMIN_USERNAME, это опасно для безопасности!'),
    adminPassword: z.string().nonempty('Установите переменную окружения ADMIN_PASS, это опасно для безопасности!'),
    adminEmail: z.string().nonempty('Установите переменную окружения ADMIN_EMAIL, это опасно для безопасности!'),
    adminEmailPassword: z.string().nonempty('Установите переменную окружения ADMIN_EMAIL_PASSWORD, это опасно для безопасности!'),
    typeSql: z.string().nonempty('Установите переменную окружения TYPE_SQL, это опасно для безопасности!'),
    hostSql: z.string().nonempty('Установите переменную окружения HOST_SQL, это опасно для безопасности!'),
    portSql: z.string().transform(val => {
        const numVal = Number(val);
        if (isNaN(numVal)) {
            throw new Error('Установите переменную окружения PORT_SQL, например: 5432');
        }
        return numVal;
    }),
    usernameSql: z.string().nonempty('Установите переменную окружения USERNAME_SQL, это опасно для безопасности!'),
    passwordSql: z.string().nonempty('Установите переменную окружения PASSWORD_SQL, это опасно для безопасности!'),
    databaseNameSql: z.string().nonempty('Установите переменную окружения DATABASE_NAME_SQL, это опасно для безопасности!'),
    /* isSwaggerEnabled: z.string().transform(val => {
        const booleanValue = configValidationUtility.convertToBoolean(val);
        if (booleanValue === null) {
            throw new Error(
                'Установите переменную окружения IS_SWAGGER_ENABLED для включения/отключения Swagger, например: true, доступные значения: true, false',
            );
        }
        return booleanValue;
    }),*/
    /*includeTestingModule: z.string().transform(val => {
    const booleanValue = configValidationUtility.convertToBoolean(val);
    if (booleanValue === null) {
        throw new Error(
            'Установите переменную окружения INCLUDE_TESTING_MODULE для включения/отключения опасного для продакшена TestingModule, например: true, доступные значения: true, false, 0, 1',
        );
    }
    return booleanValue;
}),*/
});
