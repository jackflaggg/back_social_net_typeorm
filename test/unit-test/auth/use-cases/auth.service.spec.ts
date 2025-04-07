import { AuthService } from '../../../../src/features/user-accounts/application/other_services/auth.service';
import { UserRepositoryOrm } from '../../../../src/features/user-accounts/infrastructure/typeorm/user/user.orm.repo';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import { BcryptService } from '../../../../src/features/user-accounts/application/other_services/bcrypt.service';
import { UnauthorizedDomainException } from '../../../../src/core/exceptions/incubator-exceptions/domain-exceptions';

const newUserOne = {
    id: randomUUID(),
    email: 'test@mail.ru',
    password: '123456789',
    isConfirmed: true,
    confirmationCode: randomUUID(),
};

describe('AuthService', () => {
    let authService: AuthService;
    let userRepository: UserRepositoryOrm;
    let bcryptService: BcryptService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UserRepositoryOrm,
                    useValue: {
                        findUserById: jest.fn(),
                        findUserAuth: jest.fn(),
                        findUserByEmailRaw: jest.fn(),
                        findUserByEmail: jest.fn(),
                        findUserByLoginOrEmail: jest.fn(),
                    },
                },
                {
                    provide: BcryptService,
                    useValue: {
                        hashPassword: jest.fn(),
                        comparePassword: jest.fn(), // Здесь создаем мок для comparePassword
                    },
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        userRepository = module.get<UserRepositoryOrm>(UserRepositoryOrm);
        bcryptService = module.get<BcryptService>(BcryptService);
    });

    it('⛔ возвращает ошибку, если юзер не найден', async () => {
        (userRepository.findUserByLoginOrEmail as jest.Mock).mockResolvedValue(null); // Смоделируем ситуацию, когда юзер не найден

        await expect(authService.validateUser('invalid', '00000')).rejects.toThrow(UnauthorizedDomainException); // Проверяем, что выбрасывается исключение
    });

    it('⛔ возвращает ошибку, если пароль неверный', async () => {
        (userRepository.findUserByLoginOrEmail as jest.Mock).mockResolvedValue(newUserOne); // Находим пользователя
        (bcryptService.comparePassword as jest.Mock).mockResolvedValue(false); // Моделируем неверный пароль

        await expect(authService.validateUser(newUserOne.email, 'wrongPassword')).rejects.toThrow(UnauthorizedDomainException); // Проверяем, что выбрасывается исключение
    });

    it('✅ успешно валидирует пользователя', async () => {
        (userRepository.findUserByLoginOrEmail as jest.Mock).mockResolvedValue(newUserOne); // Находим пользователя
        (bcryptService.comparePassword as jest.Mock).mockResolvedValue(true); // Моделируем успешное сравнение пароля

        const result = await authService.validateUser(newUserOne.email, newUserOne.password); // Вызываем метод

        expect(result).toEqual(newUserOne); // Проверяем, что результат соответствует ожидаемому пользователю
    });
});
