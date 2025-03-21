import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../../domain/typeorm/user/user.entity';
import { Repository } from 'typeorm';
import { EmailConfirmationToUser } from '../../../../domain/typeorm/email-confirmation/email.confirmation.entity';
import { GetUsersQueryParams } from '../../../../dto/api/get-users-query-params.input-dto';
import { MeUserIntInterface, UserViewDto } from '../../../../dto/api/user-view.dto';
import { PaginatedBlogViewDto } from '../../../../../../core/dto/base.paginated.view-dto';
import { NotFoundDomainException } from '../../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { getUsersQuery } from '../../../../utils/user/query.insert.get';

@Injectable()
export class UserQueryRepositoryOrm {
    constructor(
        @InjectRepository(User) private userRepositoryTypeOrm: Repository<User>,
        @InjectRepository(EmailConfirmationToUser) private emailConfirmationRepositoryTypeOrm: Repository<EmailConfirmationToUser>,
    ) {}
    async getAllUsers(queryData: GetUsersQueryParams) {
        const { sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm } = getUsersQuery(queryData);

        const updatedSortBy = sortBy === 'createdAt' ? 'created_at' : sortBy.toLowerCase();

        const offset = (pageNumber - 1) * pageSize;

        const cteToCountUsers =
            '(SELECT COUNT(*) FROM users WHERE deleted_at IS NULL AND (login ILIKE :login OR email ILIKE :email)) AS totalCount';

        const resultUsers = await this.userRepositoryTypeOrm
            .createQueryBuilder('u')
            .select(['u.id as id', 'u.login as login', 'u.email as email', 'u.created_at AS createdAt', cteToCountUsers])
            .where('u.deleted_at IS NULL')
            .andWhere('(u.login ILIKE :login OR u.email ILIKE :email)', {
                login: `%${searchLoginTerm}%`,
                email: `%${searchEmailTerm}%`,
            })
            .orderBy(`u.${updatedSortBy}`, `${sortDirection}`)
            .skip(offset)
            .take(pageSize)
            .getRawMany();

        const totalCount = resultUsers.length > 0 ? Number(resultUsers[0].totalcount) : 0;

        const usersView = resultUsers.map(user => UserViewDto.mapToView(user));

        return PaginatedBlogViewDto.mapToView<UserViewDto[]>({
            items: usersView,
            page: pageNumber,
            size: pageSize,
            totalCount,
        });
    }

    async getUser(userId: string) {
        const result = await this.userRepositoryTypeOrm
            .createQueryBuilder('u')
            .select('u.id as id, u.login as login, u.email as email, u.created_at as createdAt')
            .where('u.deleted_at IS NULL AND u.id = :userId', { userId })
            .getRawOne();

        if (!result) {
            throw NotFoundDomainException.create('юзер не найден', 'userId');
        }

        return UserViewDto.mapToView(result);
    }

    async getMe(userId: string) {
        const result = await this.userRepositoryTypeOrm
            .createQueryBuilder('u')
            .select('u.id, u.login AS login, u.email AS email')
            .where('u.id = :userId AND u.deleted_at IS NULL', { userId })
            .getRawOne();
        if (!result) {
            console.log(userId);
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
