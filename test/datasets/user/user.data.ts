import { UserCreateDtoApi } from '../../../src/features/user-accounts/dto/api/user.create.dto';

export const mockAppConfig = {
    hostSql: 'localhost',
    portSql: 5432,
    usernameSql: 'postgres',
    passwordSql: '230900',
    databaseNameSql: 'social_network_typeorm',
};

export function getRandomString(length: number): string {
    const characters = 'test'; // Только буквы
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

export function getRandomEmail(): string {
    const randomLogin = getRandomString(8); // Генерируем случайный логин из 8 букв
    return `${randomLogin}@mail.ru`; // Формируем email
}

// Генерация тестового пользователя
export const bodyTestCreateUser: UserCreateDtoApi = {
    login: getRandomString(8), // Случайный логин из 8 букв
    email: getRandomEmail(), // Случайный email
    password: '12345678', // Случайный пароль из 12 символов
};
