import { DynamicModule, Module } from '@nestjs/common';
import { TestingController } from './api/testing.controller';
import { config } from 'dotenv';
config();

@Module({})
export class TestingModule {
    static register(): DynamicModule {
        if (process.env.NODE_ENV !== 'production') {
            return {
                module: TestingModule,
                controllers: [TestingController],
                providers: [],
            };
        }
        return {
            module: TestingModule,
            controllers: [TestingController],
            providers: [],
        };
    }
}
