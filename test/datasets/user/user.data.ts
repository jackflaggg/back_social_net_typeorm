import { UserCreateDtoApi } from '../../../src/features/user-accounts/dto/api/user.create.dto';

export const mockAppConfig = {
    hostSql: 'localhost',
    portSql: 5432,
    usernameSql: 'postgres',
    passwordSql: '230900',
    databaseNameSql: 'social_network_typeorm',
};

export const testCreateUser: UserCreateDtoApi = {
    login: 'balabol',
    email: 'jazz@mail.ru',
    password: 'qwerty123',
};
