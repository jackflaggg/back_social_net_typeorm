import { INestApplication } from '@nestjs/common';
import { UsersTestManager } from '../helpers/users-test-helper';
import { initSettings } from '../helpers/init-settings-test';
import { JwtService } from '@nestjs/jwt';
import { deleteAllData } from '../helpers/delete-all-data-test';

describe('users', () => {
    let app: INestApplication;
    let userTestManger: UsersTestManager;

    beforeAll(async () => {
        const result = await initSettings(moduleBuilder =>
            moduleBuilder.overrideProvider(JwtService).useValue(
                new JwtService({
                    secret: 'secret_key',
                    signOptions: { expiresIn: '2s' },
                }),
            ),
        );
        app = result.app;
        userTestManger = result.userTestManger;
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(async () => {
        await deleteAllData(app);
    });

    it('should create a user', async () => {
        const createResponse = await userTestManger.createUser({
            login: 'name1',
            password: 'qwerty',
            email: 'email@email.em',
        });

        expect(createResponse).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                login: 'name1',
                email: 'email@email.em',
                // createdAt может быть проверен так:
                createdAt: expect.any(String),
            }),
        );
    });
});
