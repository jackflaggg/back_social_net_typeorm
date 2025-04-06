import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersTestManager } from './users-test-helper';
import { AppModule } from '../../src/app.module';
import { NestApplication } from '@nestjs/core';
import { mockAppConfig } from '../datasets/user/user.data';
import { EmailService } from '../../src/features/notifications/application/mail.service';
import { EmailServiceMock } from '../datasets/email/email-service.mock';

export const initSettings = async (addSettingsToModuleBuilder?: (moduleBuilder: TestingModuleBuilder) => void) => {
    const testingModuleBuilder = Test.createTestingModule({
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
    })
        .overrideProvider(EmailService)
        .useClass(EmailServiceMock);

    if (addSettingsToModuleBuilder) {
        addSettingsToModuleBuilder(testingModuleBuilder);
    }
    const testingAppModule = await testingModuleBuilder.compile();
    const app: NestApplication = testingAppModule.createNestApplication();
    await app.init();

    const httpServer = app.getHttpServer();
    const userTestManger = new UsersTestManager(app);

    return {
        app,
        httpServer,
        userTestManger,
    };
};
