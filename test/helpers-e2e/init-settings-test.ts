import { AppModule } from '../../src/app.module';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { UsersTestManager } from './users-test-helper';
import { deleteAllData } from './delete-all-data-test';
import { fullConfigApp } from '../../src/core/setup/config.setup';

export const initSettings = async (
    //передаем callback, который получает ModuleBuilder, если хотим изменить настройку тестового модуля
    addSettingsToModuleBuilder?: (moduleBuilder: TestingModuleBuilder) => void,
) => {
    const testingModuleBuilder: TestingModuleBuilder = Test.createTestingModule({
        imports: [AppModule],
    });

    if (addSettingsToModuleBuilder) {
        addSettingsToModuleBuilder(testingModuleBuilder);
    }

    const testingAppModule = await testingModuleBuilder.compile();

    const app = testingAppModule.createNestApplication();

    fullConfigApp(app);
    await app.init();

    // const databaseConnection = app.get<Connection>(getConnectionToken());
    const httpServer = app.getHttpServer();
    const userTestManger = new UsersTestManager(app);
    // const blogsTestManager = new BlogsTestManager(app);
    // const postsTestManager = new PostsTestManager(app);
    // const devicesTestManager = new DevicesTestManager(app);

    await deleteAllData(app);

    return {
        app,
        // databaseConnection,
        httpServer,
        userTestManger,
        // blogsTestManager,
        // postsTestManager,
        // devicesTestManager,
    };
};
