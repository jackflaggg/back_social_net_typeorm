import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BloggersPlatformModule } from './features/bloggers-platform/bloggers-platform.module';
import { TestingModule } from './features/testing/testing.module';
import { UsersModule } from './features/user-accounts/user-accounts.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { JwtModule } from '@nestjs/jwt';
import { SETTINGS } from './core/settings';
import process from 'node:process';
@Module({
    imports: [
        JwtModule.register({
            secret: SETTINGS.SECRET_KEY,
            signOptions: { expiresIn: '5m' },
        }),
        MongooseModule.forRoot(process.env.MONGO_URI!),
        ThrottlerModule.forRoot([
            {
                ttl: 10000,
                limit: 5,
            },
        ]),
        TestingModule,
        BloggersPlatformModule,
        UsersModule,
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class AppModule {}
