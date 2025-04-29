import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { JwtModule } from '@nestjs/jwt';
import { envModule } from './env.module';
import { CoreModule } from './core/config/core.module';
import { CustomLoggerModule } from './features/logger/logger.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './features/user-accounts/user-accounts.module';
import { TestingModule } from './features/testing/testing.module';
import { throttlerConfig } from './core/config/throttler.config';
import { typeOrmDb } from './core/config/typeorm.config';
import { AppConfig } from './core/config/app.config';
import { BloggersPlatformModule } from './features/bloggers-platform/bloggers-platform.module';

@Module({
    imports: [
        envModule,
        CoreModule,
        CustomLoggerModule,
        JwtModule.registerAsync({
            imports: [CoreModule],
            inject: [AppConfig],
            useFactory: async (coreConfig: AppConfig) => ({
                secret: coreConfig.accessTokenSecret,
                signOptions: { expiresIn: coreConfig.accessTokenExpirationTime },
            }),
        }),
        TypeOrmModule.forRootAsync({
            imports: [CoreModule],
            inject: [AppConfig],
            useFactory: async (coreConfig: AppConfig) => {
                return typeOrmDb(coreConfig);
            },
        }),
        ThrottlerModule.forRoot([throttlerConfig]),
        UsersModule,
        BloggersPlatformModule,
        TestingModule.register(),
    ],
})
export class AppModule {}
