import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { SETTINGS } from '../../src/core/settings';

export class UsersTestManager {
    constructor(private app: INestApplication) {}

    async createUser(dto: any, statusCode: number = HttpStatus.CREATED) {
        try {
            const response = await request(this.app.getHttpServer()).post('/sa/users').send(dto).auth('admin', 'qwerty').expect(statusCode);

            return response.body;
        } catch (e) {
            console.log(String(e));
        }
    }

    async deleteUser(userId: string, statusCode: number = HttpStatus.NO_CONTENT) {
        const response = await request(this.app.getHttpServer())
            .delete(`${SETTINGS.PATH.SA_USERS}/${userId}`)
            .auth('admin', 'qwerty')
            .expect(statusCode);

        return response.body;
    }

    async getUsers(queryDataOfUser: any, statusCode: number = HttpStatus.OK) {
        const response = await request(this.app.getHttpServer())
            .get(`/sa/users${queryDataOfUser}`)
            .auth('admin', 'qwerty')
            .expect(statusCode);

        return response.body;
    }
    async loginUser(dto: any) {
        const user = await this.createUser(dto);
        const loginNewUser = this.login(user.login, '12345678');
        return await loginNewUser;
    }

    async login(loginOrEmail: string, password: string, statusCode: number = HttpStatus.OK): Promise<{ accessToken: string }> {
        const response = await request(this.app.getHttpServer()).post(`/auth/login`).send({ loginOrEmail, password }).expect(statusCode);

        return {
            accessToken: response.body.accessToken,
        };
    }

    async loginWithAgent(loginOrEmail: string, password: string, agent: string, statusCode: number = HttpStatus.OK): Promise<any> {
        const response = await request(this.app.getHttpServer())
            .post(`/auth/login`)
            .set('User-Agent', agent)
            .send({ loginOrEmail, password })
            .expect(statusCode);

        return response;
    }

    async registration(createModel: any, statusCode: number = HttpStatus.CREATED): Promise<void> {
        await request(this.app.getHttpServer()).post(`/auth/registration`).send(createModel).expect(statusCode);
    }

    async me(accessToken: string, statusCode: number = HttpStatus.OK): Promise<any> {
        const response = await request(this.app.getHttpServer()).get(`/auth/me`).auth(accessToken, { type: 'bearer' }).expect(statusCode);

        return response.body;
    }
}
