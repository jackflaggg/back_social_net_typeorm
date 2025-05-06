import { DataSourceOptions } from 'typeorm';
import { configDotenv } from 'dotenv';
import process from 'node:process';
configDotenv();

export const typeOrmConfigOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.HOST_SQL,
    port: Number(process.env.PORT_SQL) || 5433,
    username: process.env.USERNAME_SQL,
    password: process.env.PASSWORD_SQL,
    database: process.env.DATABASE_NAME_SQL,
    synchronize: false,
    logging: ['error', 'warn'],
    migrationsTableName: 'custom_migration_table',
};
