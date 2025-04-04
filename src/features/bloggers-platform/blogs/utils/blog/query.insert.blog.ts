import { SortDirection } from '../../../../../core/dto/base.query-params.input-dto';
import { EntitiesSortByEnum } from '../../../../../libs/contracts/enums/post/entitiesSortByEnum';
import { convertCamelCaseToSnakeCase } from '../../../posts/utils/post/caml.case.to.snake.case';

export interface QueryBlogInputInterface {
    searchNameTerm?: string | null;
    sortBy?: EntitiesSortByEnum;
    sortDirection?: SortDirection;
    pageNumber?: number;
    pageSize?: number;
}

export interface BlogSortInterface {
    searchNameTerm: string | null;
    sortBy: string;
    sortDirection: SortDirection;
    pageNumber: number;
    pageSize: number;
}

export const getBlogsQuery = (view: QueryBlogInputInterface): BlogSortInterface => ({
    searchNameTerm: view.searchNameTerm ?? '',
    sortBy: convertCamelCaseToSnakeCase(view.sortBy || 'createdAt') ?? 'created_at',
    sortDirection: view.sortDirection?.toUpperCase() === SortDirection.Asc ? SortDirection.Asc : SortDirection.Desc,
    pageNumber: view.pageNumber ?? 1,
    pageSize: view.pageSize ?? 10,
});
