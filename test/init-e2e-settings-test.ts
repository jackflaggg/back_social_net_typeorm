import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { UsersTestManager } from './helper/users-test-helper';
import { AppModule } from '../src/app.module';
import { NestApplication } from '@nestjs/core';
import { EmailService } from '../src/features/notifications/application/mail.service';
import { EmailServiceMock } from './datasets/email/email-service.mock';

export const initSettings = async (addSettingsToModuleBuilder?: (moduleBuilder: TestingModuleBuilder) => void) => {
    const testingModuleBuilder = Test.createTestingModule({
        imports: [AppModule],
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
