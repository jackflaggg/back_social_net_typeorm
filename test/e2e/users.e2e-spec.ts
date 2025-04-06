import { INestApplication } from '@nestjs/common';
import { UsersTestManager } from '../helper/users-test-helper';
import { initSettings } from '../helper/init-settings-test';
import { deleteAllData } from './delete-all-data-test';
import { bodyTestCreateUser, getRandomEmail, getRandomString } from '../datasets/user/user.data';
import { JwtService } from '@nestjs/jwt';
import { cooldown } from '../helper/cooldown';

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
        const moduleFixture = await initSettings(moduleBuilder =>
            moduleBuilder.overrideProvider(JwtService).useValue(new JwtService({ secret: 'test_key', signOptions: { expiresIn: '1.5s' } })),
        );

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
        for (let i = 0; i < newUser.length; i++) {
            await cooldown(10);
            await userTestManger.createUser(newUser[i]);
        }
        const users = await userTestManger.getUsers('');

        expect(users.items).toHaveLength(3);
    });

    it('⭐ проверка эндпоинта "me"', async () => {
        const newUser = Array.from({ length: 1 }, () => ({
            login: getRandomString(8),
            email: getRandomEmail(),
            password: '12345678',
        }));
        const users = await userTestManger.loginUser(newUser[0]);

        expect(users);
    });

    afterAll(async () => {
        await app.close();
    });
});
