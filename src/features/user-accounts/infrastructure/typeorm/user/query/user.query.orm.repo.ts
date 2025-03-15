import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../../domain/typeorm/user/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { EmailConfirmationToUser } from '../../../../domain/typeorm/email-confirmation/email.confirmation.entity';
import { GetUsersQueryParams } from '../../../../dto/api/get-users-query-params.input-dto';
import { getUsersQuery } from '../../../../../../core/utils/user/query.insert.get';
import { MeUserIntInterface, UserViewDto } from '../../../../dto/api/user-view.dto';
import { PaginatedBlogViewDto } from '../../../../../../core/dto/base.paginated.view-dto';
import { NotFoundDomainException } from '../../../../../../core/exceptions/incubator-exceptions/domain-exceptions';

@Injectable()
export class UserQueryRepositoryOrm {
    constructor(
        @InjectRepository(User) private userRepositoryTypeOrm: Repository<User>,
        @InjectRepository(EmailConfirmationToUser) private emailConfirmationRepositoryTypeOrm: Repository<EmailConfirmationToUser>,
        @InjectEntityManager() private readonly entityManager: EntityManager,
    ) {}
    async getAllUsers(queryData: GetUsersQueryParams) {
        const { sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm } = getUsersQuery(queryData);

        const updatedSortBy = sortBy === 'createdAt' ? 'created_at' : sortBy.toLowerCase();

        const offset = (pageNumber - 1) * pageSize;

        const [resultUsers, resultTotal] = await this.userRepositoryTypeOrm
            .createQueryBuilder('users')
            .select(['users.id', 'users.login', 'users.email', 'users.created_at AS createdAt'])
            .where('users.deleted_at IS NULL')
            .andWhere('(users.login ILIKE :login OR users.email ILIKE :email)', {
                login: `%${searchLoginTerm}%`,
                email: `%${searchEmailTerm}%`,
            })
            .orderBy(`users.${updatedSortBy}`, sortDirection)
            .skip(offset)
            .take(pageSize)
            .getManyAndCount();

        const usersView = resultUsers.map(user => UserViewDto.mapToView(user));

        return PaginatedBlogViewDto.mapToView<UserViewDto[]>({
            items: usersView,
            page: pageNumber,
            size: pageSize,
            totalCount: +resultTotal[0].totalCount,
        });
    }

    async getUser(userId: string) {
        const result = await this.userRepositoryTypeOrm
            .createQueryBuilder('users')
            .select('id, login, email, created_at AS createdAt')
            .where('users.id = :userId AND users.deleted_at IS NULL', { userId })
            .getOne();
        if (!result) {
            throw NotFoundDomainException.create('юзер не найден', 'userId');
        }
        return UserViewDto.mapToView(result);
    }

    async getMe(userId: string) {
        const result = await this.userRepositoryTypeOrm
            .createQueryBuilder('users')
            .select('id AS userId, login, email')
            .where('users.id = :userId AND users.deleted_at IS NULL', { userId })
            .getOne();
        if (!result) {
            throw NotFoundDomainException.create('юзер не найден', 'userId');
        }

        // Преобразуем результат в нужный формат
        const meData: MeUserIntInterface = {
            login: result.login,
            userId: String(result.id), // Приводим id к строке
            email: result.email,
        };

        return UserViewDto.meUser(meData);
    }
}
