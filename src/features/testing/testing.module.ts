import { DynamicModule, Module } from '@nestjs/common';
import { TestingController } from './api/testing.controller';
import { config } from 'dotenv';
import { UsersModule } from '../user-accounts/user-accounts.module';
config();

@Module({
    controllers: [TestingController],
    imports: [UsersModule],
    providers: [],
})
export class TestingModule {
    // static register(): DynamicModule {
    //     if (process.env.NODE_ENV !== 'production') {
    //         return {
    //             module: TestingModule,
    //             controllers: [TestingController],
    //             imports: [UsersModule],
    //             providers: [],
    //         };
    //     }
    //     return {
    //         module: TestingModule,
    //         controllers: [TestingController],
    //         imports: [UsersModule],
    //         providers: [],
    //     };
    // }
}
