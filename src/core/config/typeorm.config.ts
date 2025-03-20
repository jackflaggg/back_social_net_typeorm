import { AppConfig } from './app.config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

export const typeOrmDb = (coreConfig: AppConfig) =>
    ({
        type: coreConfig.typeSql,
        host: coreConfig.hostSql,
        port: coreConfig.portSql,
        username: coreConfig.usernameSql,
        password: coreConfig.passwordSql,
        database: coreConfig.databaseNameSql,
        entities: [],
        synchronize: true,
        autoLoadEntities: true,
        logging: false,
        seeds: ['src/seed/seeds/**/*{.ts,.js}'],
        factories: ['src/seed/factory/**/*{.ts,.js}'],
    }) as TypeOrmModuleAsyncOptions;
