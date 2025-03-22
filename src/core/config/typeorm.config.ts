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
        synchronize: false,
        autoLoadEntities: true,
        logging: false,
    }) as TypeOrmModuleAsyncOptions;
