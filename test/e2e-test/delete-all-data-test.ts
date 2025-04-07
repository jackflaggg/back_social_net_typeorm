import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { SETTINGS } from '../../src/core/settings';

export const deleteAllData = async (app: INestApplication) => {
    const req = await request(app.getHttpServer()).delete(`/${SETTINGS.PATH.TESTING}/all-data`);
    expect(req.status).toEqual(HttpStatus.NO_CONTENT);
    return req;
};
