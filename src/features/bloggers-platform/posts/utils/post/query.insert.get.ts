import { SortDirection } from '../../../../../core/dto/base.query-params.input-dto';
import { EntitiesSortByEnum } from '../../../../../libs/contracts/enums/post/entitiesSortByEnum';
import { convertCamelCaseToSnakeCase } from './caml.case.to.snake.case';

export interface PostSortInterface {
    pageNumber: number;
    pageSize: number;
    sortBy: string;
    sortDirection: SortDirection.Desc | SortDirection.Asc;
}

export interface QueryPostInputInterface {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: EntitiesSortByEnum;
    sortDirection?: SortDirection.Desc | SortDirection.Asc;
}
export const getPostsQuery = (queryPost: QueryPostInputInterface): PostSortInterface => ({
    pageNumber: queryPost.pageNumber ?? 1,
    pageSize: queryPost.pageSize ?? 10,
    sortBy: convertCamelCaseToSnakeCase(queryPost.sortBy || 'createdAt') ?? 'created_at',
    sortDirection:
        (queryPost.sortDirection?.toUpperCase() === SortDirection.Asc ? SortDirection.Asc : SortDirection.Desc) ?? SortDirection.Desc,
});
