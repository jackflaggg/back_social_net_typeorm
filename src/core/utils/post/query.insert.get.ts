import { SortDirection } from '../../dto/base.query-params.input-dto';

export interface PostSortInterface {
    pageNumber: number;
    pageSize: number;
    sortBy: string;
    sortDirection: SortDirection.Desc | SortDirection.Asc;
}

export interface QueryPostInputInterface {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortDirection?: SortDirection.Desc | SortDirection.Asc;
}
export const getPostsQuery = (queryPost: QueryPostInputInterface): PostSortInterface => ({
    pageNumber: queryPost.pageNumber ?? 1,
    pageSize: queryPost.pageSize ?? 10,
    sortBy: queryPost.sortBy ?? 'createdAt',
    sortDirection: queryPost.sortDirection ?? SortDirection.Desc,
});
