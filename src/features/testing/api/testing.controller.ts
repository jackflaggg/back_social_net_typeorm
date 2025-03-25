import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { SETTINGS } from '../../../core/settings';
import { TablesEnum, TablesEnumType } from '../../../libs/contracts/enums/app/tables.enum';
import { LoggerService } from '../../logger/application/logger.service';

@Controller(SETTINGS.PATH.TESTING)
export class TestingController {
    constructor(
        @InjectEntityManager() protected entityManager: EntityManager,
        private loggerService: LoggerService,
    ) {
        this.loggerService.setContext(TestingController.name);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('all-data')
    async deleteAll(): Promise<void> {
        const dataTables: TablesEnumType[] = TablesEnum.options;

        for (const table of dataTables) {
            await this.entityManager.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`);
        }
        this.loggerService.log('база была очищена!');
    }
}
