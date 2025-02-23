import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SETTINGS } from '../../../core/settings';

@Controller(SETTINGS.PATH.TESTING)
export class TestingController {
    constructor(@InjectDataSource() protected dataSource: DataSource) {}

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('all-data')
    async deleteAll() {
        const dataTables = ['users', 'blogs', 'posts', 'comments', 'likes'];
        const query = `TRUNCATE TABLE ${dataTables[0]}, ${dataTables[1]}, ${dataTables[2]}, ${dataTables[3]} RESTART IDENTITY cascade`;
        await this.dataSource.query(query);
        try {
            return;
        } catch (err: unknown) {
            return err;
        }
    }
}
