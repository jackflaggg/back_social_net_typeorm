import { HttpStatus, INestApplication } from '@nestjs/common';
import { UsersTestManager } from '../helpers-e2e/users-test-helper';
import { initSettings } from '../helpers-e2e/init-settings-test';
import { JwtService } from '@nestjs/jwt';
import { deleteAllData } from '../helpers-e2e/delete-all-data-test';
import supertest from 'supertest';
import { SETTINGS } from '../../src/core/settings';

describe(SETTINGS.PATH.SA_USERS, () => {
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

    it('должен успешно создать юзера и вернуть 201 статус', async () => {
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
                createdAt: expect.any(String),
            }),
        );
        const response = await supertest(app.getHttpServer()).get('/users').auth('admin', 'qwerty').expect(HttpStatus.OK);
        expect(response.body.items).toHaveLength(1);
    });
});
