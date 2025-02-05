import { Module } from '@nestjs/common';
import { LoggerService } from './application/logger.service';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from '../../core/exceptions/incubator-exceptions/filter/all-exceptions-filter';
import { CoreConfig } from '../../core/config/core.config';

@Module({
    providers: [
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
        LoggerService,
        CoreConfig,
    ],
})
export class CustomLoggerModule {}
