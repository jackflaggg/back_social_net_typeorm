import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SETTINGS } from '../../../core/settings';
import { TablesEnum, TablesEnumType } from '../../../libs/contracts/enums/app/tables.enum';
import { LoggerService } from '../../logger/application/logger.service';
import dataSource from '../../../../migrations/db/data-source';

@Controller(SETTINGS.PATH.TESTING)
export class TestingController {
    constructor(
        @InjectDataSource() protected dataSource: DataSource,
        private loggerService: LoggerService,
    ) {
        this.loggerService.setContext(TestingController.name);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('all-data')
    async deleteAll(): Promise<void> {
        const init = await dataSource.initialize();
        const queryRunner = init.createQueryRunner();

        try {
            await queryRunner.connect();

            await queryRunner.startTransaction();
            const dataTables: TablesEnumType[] = TablesEnum.options;

            for (const table of dataTables) {
                await queryRunner.query(`TRUNCATE TABLE ${table} CASCADE`);
            }

            await queryRunner.commitTransaction();

            this.loggerService.log('база была очищена!');
        } catch (e: unknown) {
            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }
            this.loggerService.log('что то пошло не так: ' + String(e));
        } finally {
            await queryRunner.release();
        }
    }
}
