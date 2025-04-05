import { INestApplication } from '@nestjs/common';
import { UsersTestManager } from '../helper/users-test-helper';
import { initSettings } from '../helper/init-settings-test';
import { deleteAllData } from './delete-all-data-test';
import { testCreateUser } from '../datasets/user/user.data';

describe('Тесты e2e для юзеров!', () => {
    let app: INestApplication;
    let userTestManger: UsersTestManager;

    /**
     * используется для настройки окружения, инициализации данных
     * или выполнения каких-либо операций, которые должны быть
     * выполнены один раз перед всеми тестами.
     * **/
    beforeAll(async () => {
        // создаем здесь тестовый метод!
        const moduleFixture = await initSettings();

        app = moduleFixture.app;
        userTestManger = moduleFixture.userTestManger;
    });

    beforeEach(async () => {
        await deleteAllData(app);
    });

    it('успешно создай юзера!', async () => {
        const response = await userTestManger.createUser(testCreateUser);

        expect(response).toEqual({
            login: response.login,
            email: response.email,
            id: expect.any(String),
            createdAt: expect.any(String),
        });
    });

    it('успешно удали юзера!', async () => {
        const response = await userTestManger.createUser(testCreateUser);

        const users = await userTestManger.getUsers('');

        expect(users.items).toHaveLength(1);

        await userTestManger.deleteUser(response.id);

        const usersAfterDelete = await userTestManger.getUsers('');

        expect(usersAfterDelete.items).toHaveLength(0);
    });

    afterAll(async () => {
        await app.close();
    });
});
