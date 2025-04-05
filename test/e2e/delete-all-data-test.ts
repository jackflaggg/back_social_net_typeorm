import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { SETTINGS } from '../../src/core/settings';

export const deleteAllData = async (app: INestApplication) => {
    return request(app.getHttpServer()).delete(`/${SETTINGS.PATH.TESTING}/all-data`);
};
