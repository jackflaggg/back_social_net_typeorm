import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { JwtModule } from '@nestjs/jwt';
import { envModule } from './config.files';
import { CoreModule } from './core/config/core.module';
import { ConfigModule } from '@nestjs/config';
import { CustomLoggerModule } from './features/logger/logger.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './features/user-accounts/user-accounts.module';
import { TestingModule } from './features/testing/testing.module';
import { BloggersPlatformModule } from './features/bloggers-platform/bloggers-platform.module';
import { throttlerConfig } from './core/config/throttler.config';
import { typeOrmDb } from './core/config/typeorm.config';
import { AppConfig } from './core/config/app.config';

@Module({
    imports: [
        // всегда нужно задавать выше всех модулей, иначе другие модули не увидят енв!
        // предоставляет CoreConfig, который используется в других модулях
        CoreModule,
        envModule,
        CustomLoggerModule,
        JwtModule.registerAsync({
            // прежде чем модуль будет инициализирован,
            // ConfigModule должен быть загружен.
            imports: [ConfigModule],
            inject: [AppConfig],
            useFactory: async (coreConfig: AppConfig) => ({
                secret: coreConfig.accessTokenSecret,
                signOptions: { expiresIn: coreConfig.accessTokenExpirationTime },
            }),
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [AppConfig],
            useFactory: async (coreConfig: AppConfig) => typeOrmDb(coreConfig),
        }),
        ThrottlerModule.forRoot([throttlerConfig]),
        UsersModule,
        // BloggersPlatformModule,
        TestingModule.register(),
    ],
})
export class AppModule {}
