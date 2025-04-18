import { DataSource } from 'typeorm';
import { User } from '../../features/user-accounts/domain/typeorm/user/user.entity';

export const seedData = async (dataSource: DataSource) => {
    const userRepo = dataSource.getRepository(User);

    const usersCount = await userRepo.count();
    if (!usersCount) {
        await userRepo.insert([
            {
                login: 'bobbbbb',
                email: 'test11@mail.ru',
            },
        ]);
    }
};
