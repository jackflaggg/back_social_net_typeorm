import { SortDirection } from '../../../../../core/dto/base.query-params.input-dto';
import { blogSortBy } from '../../../../../libs/contracts/enums/blog/blog.sort.by.enum';

export interface QueryBlogInputInterface {
    searchNameTerm?: string | null;
    sortBy?: string;
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
    sortBy: view.sortBy ?? blogSortBy.enum['createdAt'],
    sortDirection: view.sortDirection?.toUpperCase() === SortDirection.Desc ? SortDirection.Desc : SortDirection.Asc,
    pageNumber: view.pageNumber ?? 1,
    pageSize: view.pageSize ?? 10,
});
