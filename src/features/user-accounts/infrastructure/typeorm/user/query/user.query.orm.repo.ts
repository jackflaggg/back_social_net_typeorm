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

        const resultUsers = await this.userRepositoryTypeOrm
            .createQueryBuilder('u')
            .select(['u.id as id', 'u.login as login', 'u.email as email', 'u.created_at AS createdAt'])
            .where('u.deleted_at IS NULL')
            .andWhere('u.login ILIKE :login OR u.email ILIKE :email', {
                login: `%${searchLoginTerm}%`,
                email: `%${searchEmailTerm}%`,
            })
            .orderBy(`u.${updatedSortBy}`, sortDirection)
            .skip(offset)
            .take(pageSize)
            .getRawMany();
        console.log(resultUsers);

        const usersView = resultUsers.map(user => UserViewDto.mapToView(user));

        return PaginatedBlogViewDto.mapToView<UserViewDto[]>({
            items: usersView,
            page: pageNumber,
            size: pageSize,
            totalCount: 1 /*resultTotal*/,
        });
    }

    // TODO: не используем для доставки умных сущностей!
    async getUser(userId: string) {
        const result = await this.userRepositoryTypeOrm
            .createQueryBuilder('u')
            //.select('u.id, u.login, u.email')
            .where('u.id = :userId', { userId })
            .andWhere('u.deleted_at IS NULL')
            .execute();
        console.log(result);
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
