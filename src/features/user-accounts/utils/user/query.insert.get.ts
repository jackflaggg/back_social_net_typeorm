import { SortDirection } from '../../../../core/dto/base.query-params.input-dto';
import { convertCamelCaseToSnakeCase } from '../../../bloggers-platform/posts/utils/post/caml.case.to.snake.case';
import { EntitiesSortByEnum } from '../../../../libs/contracts/enums/post/entitiesSortByEnum';

export interface QueryUsers {
    sortBy?: EntitiesSortByEnum;
    sortDirection?: SortDirection;
    pageNumber?: number;
    pageSize?: number;
    searchLoginTerm?: string | null;
    searchEmailTerm?: string | null;
}

export interface QueryUsersOutputInterface {
    sortBy: string;
    sortDirection: SortDirection;
    pageNumber: number;
    pageSize: number;
    searchLoginTerm: string | null;
    searchEmailTerm: string | null;
}

export const getUsersQuery = (queryUser: QueryUsers): QueryUsersOutputInterface => ({
    sortBy: convertCamelCaseToSnakeCase(queryUser.sortBy || 'createdAt') ?? 'created_at',
    sortDirection: queryUser.sortDirection?.toUpperCase() === SortDirection.Asc ? SortDirection.Asc : SortDirection.Desc,
    pageNumber: queryUser.pageNumber ?? 1,
    pageSize: queryUser.pageSize ?? 10,
    searchLoginTerm: queryUser.searchLoginTerm ?? '',
    searchEmailTerm: queryUser.searchEmailTerm ?? '',
});
