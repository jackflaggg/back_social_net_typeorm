import { SortDirection } from '../../dto/base.query-params.input-dto';

export interface CommentSortInterface {
    pageNumber: number;
    pageSize: number;
    sortBy: string;
    sortDirection: SortDirection.Desc | SortDirection.Asc;
}

export interface QueryCommentInputInterface {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortDirection?: SortDirection.Desc | SortDirection.Asc;
}
export const getCommentQuery = (queryPost: QueryCommentInputInterface): CommentSortInterface => ({
    pageNumber: queryPost.pageNumber ?? 1,
    pageSize: queryPost.pageSize ?? 10,
    sortBy: queryPost.sortBy ?? 'createdAt',
    sortDirection: queryPost.sortDirection ?? SortDirection.Desc,
});
