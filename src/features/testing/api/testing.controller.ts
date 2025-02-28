import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SETTINGS } from '../../../core/settings';
import { TablesEnum } from '../../../libs/contracts/enums/tables.enum';

@Controller(SETTINGS.PATH.TESTING)
export class TestingController {
    constructor(@InjectDataSource() protected dataSource: DataSource) {}

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('all-data')
    async deleteAll(): Promise<void> {
        const dataTables = [
            TablesEnum.enum['users'],
            TablesEnum.enum['blogs'],
            TablesEnum.enum['posts'],
            TablesEnum.enum['comments'],
            TablesEnum.enum['likes'],
        ];

        let allWords: string = '';

        for (let i = 0; i < dataTables.length; i++) {
            allWords += dataTables[i];

            if (i < dataTables.length - 1) {
                allWords += ', ';
            }
        }

        const query = `TRUNCATE TABLE ${allWords} RESTART IDENTITY cascade`;
        await this.dataSource.query(query);
    }
}
