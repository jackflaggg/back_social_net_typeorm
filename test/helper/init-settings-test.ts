import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from '../../src/app.module';
import { AppConfig } from '../../src/core/config/app.config';
import { fullConfigApp } from '../../src/core/setup/config.setup';
import { UsersTestManager } from './users-test-helper';

export const initSettings = async () => {
    const testingModuleBuilder: TestingModuleBuilder = Test.createTestingModule({
        imports: [
            AppModule,
            TypeOrmModule.forRootAsync({
                useFactory: (coreConfig: AppConfig) => ({
                    type: 'postgres',
                    host: coreConfig.hostSql, // Адрес вашего сервера PostgreSQL
                    port: coreConfig.portSql, // Порт по умолчанию
                    username: coreConfig.usernameSql, // Ваше имя пользователя
                    password: coreConfig.passwordSql, // Ваш пароль
                    database: coreConfig.databaseNameSqlTest, // Имя вашей базы данных
                    entities: [], // Здесь укажите ваши сущности
                    autoLoadEntities: true, // Не загружать сущности автоматически - можно true для разработки
                    synchronize: true, // Для разработки, включите, чтобы синхронизировать с базой данных - можно true для разработки
                }),
                inject: [AppConfig],
            }),
        ],
    });

    const testingAppModule: TestingModule = await testingModuleBuilder.compile();

    const app = testingAppModule.createNestApplication();
    const coreConfig: AppConfig = app.get<AppConfig>(AppConfig);

    fullConfigApp(app, coreConfig);

    await app.init();

    const httpServer = app.getHttpServer();
    const userTestManger = new UsersTestManager(app);
    return {
        app,
        httpServer,
        userTestManger,
    };
};
