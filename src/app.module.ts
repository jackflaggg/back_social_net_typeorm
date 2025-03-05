import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { JwtModule } from '@nestjs/jwt';
import { configModule } from './config';
import { CoreConfig } from './core/config/core.config';
import { CoreModule } from './core/config/config.module';
import { ConfigModule } from '@nestjs/config';
import { CustomLoggerModule } from './features/logger/logger.module';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { UsersModule } from './features/user-accounts/user-accounts.module';
import { TestingModule } from './features/testing/testing.module';
import { BloggersPlatformModule } from './features/bloggers-platform/bloggers-platform.module';

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
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [CoreConfig],
            useFactory: async (coreConfig: CoreConfig) =>
                ({
                    type: coreConfig.typeSql,
                    host: coreConfig.hostSql,
                    port: coreConfig.portSql,
                    username: coreConfig.usernameSql,
                    password: coreConfig.passwordSql,
                    database: coreConfig.databaseNameSql,
                    entities: [],
                    synchronize: true,
                    // можете потерять рабочие данные
                    autoLoadEntities: true,
                    // Чтобы автоматически загружать сущности
                    logging: true,
                }) as TypeOrmModuleAsyncOptions,
        }),
        ThrottlerModule.forRoot([
            {
                ttl: 10000,
                limit: 5,
            },
        ]),
        TestingModule.register(),
        UsersModule,
        BloggersPlatformModule,
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class AppModule {}
