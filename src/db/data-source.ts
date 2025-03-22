import { DataSource } from 'typeorm';
import { typeOrmConfigOptions } from './migration.config';

export default new DataSource({
    ...typeOrmConfigOptions,
    entities: ['src/features/**/domain/typeorm/*.entity.ts'],
    migrations: [__dirname + `/migrations/*.ts`],
});

console.log('new date!');
