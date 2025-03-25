import { Module } from '@nestjs/common';
import { LoggerService } from './application/logger.service';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from '../../core/exceptions/incubator-exceptions/filter/all-exceptions-filter';
import { AppConfig } from '../../core/config/app.config';

@Module({
    providers: [
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
        LoggerService,
        AppConfig,
    ],
    exports: [LoggerService],
})
export class CustomLoggerModule {}
