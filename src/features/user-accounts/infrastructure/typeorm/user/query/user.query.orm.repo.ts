import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../../domain/typeorm/user/user.entity';
import { Brackets, Repository } from 'typeorm';
import { GetUsersQueryParams } from '../../../../dto/api/get-users-query-params.input-dto';
import { MeUserIntInterface, UserViewDto } from '../../../../dto/api/user-view.dto';
import { PaginatedUserViewDto, PaginatedViewDto } from '../../../../../../core/dto/base.paginated.view-dto';
import { NotFoundDomainException } from '../../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { getUsersQuery } from '../../../../utils/user/query.insert.get';
import { PaginationParams } from '../../../../../../core/dto/base.query-params.input-dto';

@Injectable()
export class UserQueryRepositoryOrm {
    constructor(@InjectRepository(User) private userRepositoryTypeOrm: Repository<User>) {}
    async getAllUsers(queryData: GetUsersQueryParams): Promise<PaginatedViewDto<UserViewDto[]>> {
        const { sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm } = getUsersQuery(queryData);

        const offset = PaginationParams.calculateSkip({ pageNumber, pageSize });

        const queryBuilder = this.userRepositoryTypeOrm.createQueryBuilder('u').where('u.deleted_at IS NULL');

        if (searchEmailTerm || searchLoginTerm) {
            queryBuilder.andWhere(
                new Brackets(qb =>
                    qb
                        .where('u.login ILIKE :login', { login: `%${searchLoginTerm}%` })
                        .orWhere('u.email ILIKE :email', { email: `%${searchEmailTerm}%` }),
                ),
            );
        }
        const resultUsers = await queryBuilder
            .select(['u.id AS id, u.login AS login, u.email AS email, u.created_at AS "createdAt"'])
            .orderBy(`u.${sortBy}`, `${sortDirection}`)
            .skip(offset)
            .take(pageSize)
            .getRawMany();

        const totalCount = await queryBuilder.getCount();

        const usersView = resultUsers.map(user => UserViewDto.mapToView(user));

        return PaginatedUserViewDto.mapToView<UserViewDto[]>({
            items: usersView,
            page: pageNumber,
            size: pageSize,
            totalCount,
        });
    }

    async getUser(userId: string): Promise<UserViewDto> {
        const result = await this.userRepositoryTypeOrm
            .createQueryBuilder('u')
            .select('u.id as id, u.login as login, u.email as email, u.created_at as "createdAt"')
            .where('u.deleted_at IS NULL AND u.id = :userId', { userId })
            .getRawOne();

        if (!result) {
            throw NotFoundDomainException.create('юзер не найден', 'userId');
        }

        return UserViewDto.mapToView(result);
    }

    async getMe(userId: string): Promise<MeUserIntInterface> {
        const result = await this.userRepositoryTypeOrm
            .createQueryBuilder('u')
            .select('u.id as "userId", u.login AS login, u.email AS email')
            .where('u.id = :userId AND u.deleted_at IS NULL', { userId })
            .getRawOne();
        if (!result) {
            throw NotFoundDomainException.create('юзер не найден', 'userId');
        }

        return UserViewDto.meUser(result);
    }
}
