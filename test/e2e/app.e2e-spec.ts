import { INestApplication } from '@nestjs/common';
import { UsersTestManager } from '../helper/users-test-helper';
import { initSettings } from '../helper/init-settings-test';
import { deleteAllData } from './delete-all-data-test';
import { bodyTestCreateUser, getRandomEmail, getRandomString } from '../datasets/user/user.data';

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

    it('⭐ успешно создай юзера!', async () => {
        const response = await userTestManger.createUser(bodyTestCreateUser);

        expect(response).toEqual({
            login: response.login,
            email: response.email,
            id: expect.any(String),
            createdAt: expect.any(String),
        });
    });

    it('⭐ успешно удали юзера!', async () => {
        const response = await userTestManger.createUser(bodyTestCreateUser);

        const users = await userTestManger.getUsers('');

        expect(users.items).toHaveLength(1);

        await userTestManger.deleteUser(response.id);

        const usersAfterDelete = await userTestManger.getUsers('');

        expect(usersAfterDelete.items).toHaveLength(0);
    });

    it('⭐ успешно получи созданных юзеров!', async () => {
        const newUser = Array.from({ length: 3 }, () => ({
            login: getRandomString(8),
            email: getRandomEmail(),
            password: '12345678',
        }));
        await userTestManger.createUser(newUser[0]);
        await userTestManger.createUser(newUser[1]);
        await userTestManger.createUser(newUser[2]);
        const users = await userTestManger.getUsers('');

        expect(users.items).toHaveLength(3);
    });

    afterAll(async () => {
        await app.close();
    });
});
