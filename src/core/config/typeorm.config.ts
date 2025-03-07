import { CoreConfig } from './core.config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

export const typeOrmDb = (coreConfig: CoreConfig) => ({
        type: coreConfig.typeSql,
        host: coreConfig.hostSql,
        port: coreConfig.portSql,
        username: coreConfig.usernameSql,
        password: coreConfig.passwordSql,
        database: coreConfig.databaseNameSql,
        entities: [],
        synchronize: true,
        autoLoadEntities: true,
        logging: true,
    }) as TypeOrmModuleAsyncOptions;
