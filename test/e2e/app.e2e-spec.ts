import { INestApplication } from '@nestjs/common';
import { UsersTestManager } from '../helper/users-test-helper';
import { initSettings } from '../helper/init-settings-test';
import { deleteAllData } from './delete-all-data-test';
import { SETTINGS } from '../../src/core/settings';

describe(SETTINGS.PATH.SA_USERS, () => {
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

    it('успешно создай юзера!', async () => {
        const response = await userTestManger.createUser({
            login: 'balabol',
            email: 'balabol@mail.ru',
            password: '1234567890',
        });

        expect(response).toEqual({
            login: response.login,
            email: response.email,
            id: expect.stringContaining(response.id),
            createdAt: expect.any(String),
        });
        console.log(response);
    });
});
