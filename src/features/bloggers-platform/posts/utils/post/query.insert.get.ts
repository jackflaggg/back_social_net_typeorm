import { SortDirection } from '../../../../../core/dto/base.query-params.input-dto';
import { entitiesSortBy, EntitiesSortByEnum } from '../../../../../libs/contracts/enums/post/entitiesSortByEnum';

export interface PostSortInterface {
    pageNumber: number;
    pageSize: number;
    sortBy: EntitiesSortByEnum;
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
    sortBy: queryPost.sortBy ?? entitiesSortBy.enum['createdAt'],
    sortDirection: queryPost.sortDirection ?? SortDirection.Desc,
});
