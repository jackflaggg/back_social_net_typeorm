import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { SETTINGS } from '../../src/core/settings';

export class UsersTestManager {
    constructor(private app: INestApplication) {}

    async createUser(dto: any, statusCode: number = HttpStatus.CREATED) {
        const response = await request(this.app.getHttpServer()).post('/sa/users').send(dto).auth('admin', 'qwerty').expect(statusCode);

        return response.body;
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
}
