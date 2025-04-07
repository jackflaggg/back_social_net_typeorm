import { UserRepositoryOrm } from '../../../src/features/user-accounts/infrastructure/typeorm/user/user.orm.repo';
import { AuthService } from '../../../src/features/user-accounts/application/other_services/auth.service';
import { BcryptService } from '../../../src/features/user-accounts/application/other_services/bcrypt.service';
import { randomUUID } from 'node:crypto';
import { initIntegrationTestingModule } from '../../init-integration-settings-test';
import { User } from '../../../src/features/user-accounts/domain/typeorm/user/user.entity';
import { EmailConfirmationRepositoryOrm } from '../../../src/features/user-accounts/infrastructure/typeorm/email-conf/email.orm.conf.repository';
import { DataSource } from 'typeorm';

const newUserOne = {
    id: randomUUID(),
    email: 'test@mail.ru',
    password: '123456789',
    isConfirmed: true,
    confirmationCode: randomUUID(),
};

describe('AuthService Integration Tests', () => {
    let authService: AuthService;
    let userRepository: UserRepositoryOrm;
    let bcryptService: BcryptService;
    let emailConfRepository: EmailConfirmationRepositoryOrm;
    let dataSource: DataSource;

    beforeAll(async () => {
        const module = await initIntegrationTestingModule();
        authService = module.get<AuthService>(AuthService);
        userRepository = module.get<UserRepositoryOrm>(UserRepositoryOrm);
        bcryptService = module.get<BcryptService>(BcryptService);
        emailConfRepository = module.get<EmailConfirmationRepositoryOrm>(EmailConfirmationRepositoryOrm);
        dataSource = module.get<DataSource>(DataSource);
    });

    beforeAll(async () => {
        await dataSource.query('TRUNCATE TABLE users CASCADE');
    });

    it('test', () => {
        expect(1).toEqual(1);
    });

    it('должен успешно валидировать пользователя', async () => {
        const hashedPassword = await bcryptService.hashPassword(newUserOne.password);
        const userId = await userRepository.createUser({
            login: 'test1',
            email: 'test1@mail.ru',
            password: hashedPassword,
            sentEmailRegistration: true,
        });

        await emailConfRepository.createEmailConfirmationToUser(
            { confirmationCode: randomUUID(), expirationDate: new Date(), isConfirmed: true },
            userId,
        );
        const getUser = await userRepository.findUserByEmail('test1@mail.ru');

        expect(getUser).toBeInstanceOf(User);
        const result = await authService.validateUser('test1@mail.ru', '123456789');

        expect({
            email: 'test1@mail.ru',
            id: userId,
            password: hashedPassword,
        }).toEqual({
            email: result.email,
            id: result.id,
            password: result.password,
        });
    });
});
