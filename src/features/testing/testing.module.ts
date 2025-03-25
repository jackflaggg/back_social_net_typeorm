import { DynamicModule, Module } from '@nestjs/common';
import { TestingController } from './api/testing.controller';
import { config } from 'dotenv';
import { CustomLoggerModule } from '../logger/logger.module';
config();

@Module({})
export class TestingModule {
    static register(): DynamicModule {
        if (process.env.NODE_ENV !== 'production') {
            return {
                module: TestingModule,
                imports: [CustomLoggerModule],
                controllers: [TestingController],
                providers: [],
            };
        }
        return {
            imports: [CustomLoggerModule],
            module: TestingModule,
            controllers: [TestingController],
            providers: [],
        };
    }
}
