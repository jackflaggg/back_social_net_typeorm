import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { SETTINGS } from '../../../core/settings';
import { TablesEnum, TablesEnumType } from '../../../libs/contracts/enums/app/tables.enum';

@Controller(SETTINGS.PATH.TESTING)
export class TestingController {
    constructor(@InjectEntityManager() protected entityManager: EntityManager) {}

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('all-data')
    async deleteAll(): Promise<void> {
        const dataTables: Exclude<TablesEnumType, 'likes'>[] = [
            TablesEnum.enum['users'],
            TablesEnum.enum['blogs'],
            TablesEnum.enum['posts'],
            TablesEnum.enum['comments'],
        ];

        for (const table of dataTables) {
            await this.entityManager.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`);
        }
    }
}
