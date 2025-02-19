import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { GetUsersQueryParams } from '../../../../dto/api/get-users-query-params.input-dto';
import { PaginatedBlogViewDto } from '../../../../../../core/dto/base.paginated.view-dto';
import { UserViewDto } from '../../../../dto/api/user-view.dto';
import { getUsersQuery } from '../../../../../../core/utils/user/query.insert.get';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class UserPgQueryRepository {
    constructor(@InjectDataSource() protected dataSource: DataSource) {}

    async getAllUsers(queryData: GetUsersQueryParams) {
        const { sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm } = getUsersQuery(queryData);
        const offset = (pageNumber - 1) * pageSize;
        const queryUsers = `
            SELECT "id", "login", "email", "createdat" FROM "users" WHERE "deletedat" IS NULL AND ("login" ilike '%' || $1 || '%' OR "email" ilike '%' || $2 || '%')
            ORDER BY "${sortBy}" ${sortDirection.toUpperCase()}
            LIMIT $3
            OFFSET $4
            `;

        const resultUsers = await this.dataSource.query(queryUsers, [searchLoginTerm, searchEmailTerm, pageSize, offset]);

        const queryCount = `
            SELECT COUNT(*) as "totalCount" FROM "users" WHERE "deletedat" IS NULL AND ("login" ilike '%' || $1 || '%' OR "email" ilike '%' || $2 || '%')
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
        SELECT "id", "login", "email", "createdat" FROM "users" WHERE "deletedat" IS NULL AND "id" = $1
        `;
        const result = await this.dataSource.query(queryUser, [userId]);
        if (!result || result.length === 0) {
            return void 0;
        }
        return result[0];
    }
}
