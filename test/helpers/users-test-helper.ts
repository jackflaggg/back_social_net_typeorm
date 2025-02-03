import request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';

export class UsersTestManager {
    constructor(private app: INestApplication) {}

    async createUser(createModel: any, statusCode: number = HttpStatus.CREATED) {
        const response = await request(this.app.getHttpServer())
            .post(`/users`)
            .send(createModel)
            .auth('admin', 'qwerty')
            .expect(statusCode);

        return response.body;
    }
}
