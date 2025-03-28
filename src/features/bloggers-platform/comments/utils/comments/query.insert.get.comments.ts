import { SortDirection } from '../../../../../core/dto/base.query-params.input-dto';
import { convertCamelCaseToSnakeCase } from '../../../posts/utils/post/caml.case.to.snake.case';
import { EntitiesSortByEnum } from '../../../../../libs/contracts/enums/post/entitiesSortByEnum';

export interface CommentSortInterface {
    pageNumber: number;
    pageSize: number;
    sortBy: string;
    sortDirection: SortDirection;
}

export interface QueryCommentInputInterface {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: EntitiesSortByEnum;
    sortDirection?: SortDirection;
}
export const getCommentQuery = (queryComment: QueryCommentInputInterface): CommentSortInterface => ({
    pageNumber: queryComment.pageNumber ?? 1,
    pageSize: queryComment.pageSize ?? 10,
    sortBy: convertCamelCaseToSnakeCase(queryComment.sortBy || 'createdAt') ?? 'created_at',
    sortDirection:
        (queryComment.sortDirection?.toUpperCase() === SortDirection.Asc ? SortDirection.Asc : SortDirection.Desc) ?? SortDirection.Desc,
});
