import { SortDirection } from '../../dto/base.query-params.input-dto';

export interface QueryUsers {
    sortBy?: string;
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
    sortBy: queryUser.sortBy ?? 'createdAt',
    sortDirection: queryUser.sortDirection ?? SortDirection.Desc,
    pageNumber: queryUser.pageNumber ?? 1,
    pageSize: queryUser.pageSize ?? 10,
    searchLoginTerm: queryUser.searchLoginTerm ?? '',
    searchEmailTerm: queryUser.searchEmailTerm ?? '',
});
