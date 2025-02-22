import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { UserPgRepository } from '../../user-accounts/infrastructure/postgres/user/user.pg.repository';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('testing')
export class TestingController {
    constructor(@InjectDataSource() protected dataSource: DataSource) {}

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('all-data')
    async deleteAll() {
        const dataTables = ['users', 'blogs'];
        const query = `TRUNCATE TABLE ${dataTables[0]}, ${dataTables[1]} RESTART IDENTITY cascade`;
        await this.dataSource.query(query);
        try {
            return;
        } catch (err: unknown) {
            return err;
        }
    }
}
