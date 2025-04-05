import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersTestManager } from './users-test-helper';
import { AppModule } from '../../src/app.module';
import { NestApplication } from '@nestjs/core';
import { mockAppConfig } from '../datasets/user/user.data';

export const initSettings = async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
        imports: [
            TypeOrmModule.forRootAsync({
                useFactory: () => ({
                    type: 'postgres',
                    host: mockAppConfig.hostSql,
                    port: mockAppConfig.portSql,
                    username: mockAppConfig.usernameSql,
                    password: mockAppConfig.passwordSql,
                    database: mockAppConfig.databaseNameSql + '_test',
                    entities: [
                        // Ваши сущности
                    ],
                    autoLoadEntities: true,
                    synchronize: true,
                }),
            }),
            // TODO: Работает, только когда аппмодуль после тайпорм!
            AppModule,
        ],
    }).compile();

    const app: NestApplication = testingModule.createNestApplication();
    await app.init();

    const httpServer = app.getHttpServer();
    const userTestManger = new UsersTestManager(app);

    return {
        app,
        httpServer,
        userTestManger,
    };
};
