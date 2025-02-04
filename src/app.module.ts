import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BloggersPlatformModule } from './features/bloggers-platform/bloggers-platform.module';
import { TestingModule } from './features/testing/testing.module';
import { UsersModule } from './features/user-accounts/user-accounts.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { JwtModule } from '@nestjs/jwt';
import { SETTINGS } from './core/settings';
import { configModule } from './config';
import { CoreConfig } from './core/config/core.config';
import { CoreModule } from './core/config/config.module';

@Module({
    imports: [
        // всегда нужно задавать выше всех модулей, иначе другие модули не увидят енв!
        CoreModule,
        configModule,
        JwtModule.register({
            secret: SETTINGS.SECRET_KEY,
            signOptions: { expiresIn: '5m' },
        }),
        MongooseModule.forRootAsync({
            useFactory: (coreConfig: CoreConfig) => ({
                uri: coreConfig.mongoUrl,
                autoLoadEntities: true, // Не загружать сущности автоматически - можно true для разработки
                synchronize: true, // Для разработки, включите, чтобы синхронизировать с базой данных - можно true для разработки
                logging: true,
            }),
            inject: [CoreConfig],
        }),
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
