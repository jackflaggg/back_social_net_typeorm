import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BloggersPlatformModule } from './features/bloggers-platform/bloggers-platform.module';
import { TestingModule } from './features/testing/testing.module';
import { UsersModule } from './features/user-accounts/user-accounts.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { JwtModule } from '@nestjs/jwt';
import { configModule } from './config';
import { CoreConfig } from './core/config/core.config';
import { CoreModule } from './core/config/config.module';
import { ConfigModule } from '@nestjs/config';
import { CustomLoggerModule } from './features/logger/logger.module';

@Module({
    imports: [
        // всегда нужно задавать выше всех модулей, иначе другие модули не увидят енв!
        CoreModule,
        configModule,
        CustomLoggerModule,
        JwtModule.registerAsync({
            // прежде чем JwtModule будет инициализирован, ConfigModule должен быть загружен.
            imports: [ConfigModule],
            inject: [CoreConfig],
            useFactory: async (coreConfig: CoreConfig) => ({
                secret: coreConfig.accessTokenSecret,
                signOptions: { expiresIn: coreConfig.accessTokenExpirationTime },
            }),
        }),
        MongooseModule.forRootAsync({
            useFactory: (coreConfig: CoreConfig) => ({
                uri: coreConfig.mongoUrl,
            }),
            inject: [CoreConfig],
        }),
        ThrottlerModule.forRoot([
            {
                ttl: 10000,
                limit: 5,
            },
        ]),
        TestingModule.register(),
        BloggersPlatformModule,
        UsersModule,
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class AppModule {}
