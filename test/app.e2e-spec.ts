import { INestApplication } from '@nestjs/common';
import { UsersTestManager } from './e2e/users-test-helper';
import { initSettings } from './e2e/init-settings-test';
import { deleteAllData } from './e2e/delete-all-data-test';

describe('/sa/users', () => {
    console.log(__dirname);
    let app: INestApplication;
    let userTestManger: UsersTestManager;

    beforeAll(async () => {
        const result = await initSettings();

        app = result.app;
        userTestManger = result.userTestManger;
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(async () => {
        await deleteAllData(app);
    });

    it('should create user', async () => {
        const response = await userTestManger.createUser({
            login: 'jack23',
            email: 'rasul.khamzin@mail.ru',
            password: '1234567890',
        });

        expect(response).toEqual({
            login: response.login,
            email: response.email,
            id: expect.any(String),
            createdAt: expect.any(String),
        });
    });
});
