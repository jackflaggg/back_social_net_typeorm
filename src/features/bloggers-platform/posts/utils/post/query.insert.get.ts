import { SortDirection } from '../../../../../core/dto/base.query-params.input-dto';
import { postSortBy, PostSortByEnum } from '../../../../../libs/contracts/enums/post/post.sort.by.enum';

export interface PostSortInterface {
    pageNumber: number;
    pageSize: number;
    sortBy: PostSortByEnum;
    sortDirection: SortDirection.Desc | SortDirection.Asc;
}

export interface QueryPostInputInterface {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: PostSortByEnum;
    sortDirection?: SortDirection.Desc | SortDirection.Asc;
}
export const getPostsQuery = (queryPost: QueryPostInputInterface): PostSortInterface => ({
    pageNumber: queryPost.pageNumber ?? 1,
    pageSize: queryPost.pageSize ?? 10,
    sortBy: queryPost.sortBy ?? postSortBy.enum['createdAt'],
    sortDirection: queryPost.sortDirection ?? SortDirection.Desc,
});
