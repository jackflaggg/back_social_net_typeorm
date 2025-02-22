import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { GetUsersQueryParams } from '../../../../dto/api/get-users-query-params.input-dto';
import { PaginatedBlogViewDto } from '../../../../../../core/dto/base.paginated.view-dto';
import { UserViewDto } from '../../../../dto/api/user-view.dto';
import { getUsersQuery } from '../../../../../../core/utils/user/query.insert.get';
import { InjectDataSource } from '@nestjs/typeorm';
import { NotFoundDomainException } from '../../../../../../core/exceptions/incubator-exceptions/domain-exceptions';

@Injectable()
export class UserPgQueryRepository {
    constructor(@InjectDataSource() protected dataSource: DataSource) {}

    async getAllUsers(queryData: GetUsersQueryParams) {
        const { sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm } = getUsersQuery(queryData);

        const updatedSortBy = sortBy === 'createdAt' ? 'created_at' : sortBy.toLowerCase();

        const offset = (pageNumber - 1) * pageSize;

        const queryUsers = `
            SELECT "id", "login", "email", "created_at" AS "createdAt" FROM "users" WHERE "deleted_at" IS NULL AND ("login" ILIKE '%' || $1 || '%' OR "email" ILIKE '%' || $2 || '%')
            ORDER BY ("${updatedSortBy}") ${sortDirection.toUpperCase()}
            LIMIT $3
            OFFSET $4
            `;

        const resultUsers = await this.dataSource.query(queryUsers, [searchLoginTerm, searchEmailTerm, Number(pageSize), Number(offset)]);

        const queryCount = `
            SELECT COUNT(*) AS "totalCount" FROM "users" WHERE "deleted_at" IS NULL AND ("login" ILIKE '%' || $1 || '%' OR "email" ILIKE '%' || $2 || '%')
        `;
        const resultTotal = await this.dataSource.query(queryCount, [searchLoginTerm, searchEmailTerm]);

        const usersView = resultUsers.map(user => UserViewDto.mapToView(user));

        return PaginatedBlogViewDto.mapToView<UserViewDto[]>({
            items: usersView,
            page: pageNumber,
            size: pageSize,
            totalCount: +resultTotal[0].totalCount,
        });
    }

    async getUser(userId: string) {
        const queryUser = `
        SELECT "id", "login", "email", "created_at" as "createdAt" FROM "users" WHERE "deleted_at" IS NULL AND "id" = $1
        `;
        const result = await this.dataSource.query(queryUser, [userId]);
        if (!result || result.length === 0) {
            throw NotFoundDomainException.create('юзер не найден', 'userId');
        }
        return UserViewDto.mapToView(result[0]);
    }

    async getMe(userId: string) {
        const queryUser = `
        SELECT "id" as "userId", "login", "email" FROM "users" WHERE "deleted_at" IS NULL AND "id" = $1
        `;
        const result = await this.dataSource.query(queryUser, [userId]);
        if (!result || result.length === 0) {
            throw NotFoundDomainException.create('юзер не найден', 'userId');
        }
        return UserViewDto.meUser(result[0]);
    }
}
