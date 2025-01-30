import { BaseSortablePaginationParams } from '../../../../../../core/dto/base.query-params.input-dto';
import { BlogsSortBy } from '../../../../blogs/dto/repository/query/blogs-sort-by';
import { IsEnum } from 'class-validator';
import { CommentSortBy } from './comment-sort-by';

export class GetCommentsQueryParams extends BaseSortablePaginationParams<CommentSortBy> {
    @IsEnum(BlogsSortBy)
    sortBy = CommentSortBy.CreatedAt;
}
