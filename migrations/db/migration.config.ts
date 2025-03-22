import { DataSourceOptions } from 'typeorm';

export const typeOrmConfigOptions: DataSourceOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '230900',
    database: 'social_network_typeorm',
    synchronize: false,
    logging: true,
};
