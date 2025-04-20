import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SETTINGS } from '../../../core/settings';
import { TablesEnum, TablesEnumType } from '../../../libs/contracts/enums/app/tables.enum';
import { LoggerService } from '../../logger/application/logger.service';

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
        const dataTables: TablesEnumType[] = TablesEnum.options;
        try {
            await this.dataSource.transaction(async entityManager => {
                for (const table of dataTables) {
                    await entityManager.query(`TRUNCATE TABLE ${table} CASCADE`);
                }
            });

            this.loggerService.log('База была очищена!');
        } catch (e: unknown) {
            this.loggerService.log('что то пошло не так: ' + String(e));
        } finally {
            this.loggerService.log('👌');
        }
    }
}
