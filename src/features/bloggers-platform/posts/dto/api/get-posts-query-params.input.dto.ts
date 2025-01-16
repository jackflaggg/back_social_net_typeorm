import { BaseSortablePaginationParams } from '../../../../../core/dto/base.query-params.input-dto';
import { IsEnum } from 'class-validator';
import { PostsSortBy } from './post-sort-by';

export class GetPostsQueryParams extends BaseSortablePaginationParams<PostsSortBy> {
    @IsEnum(PostsSortBy)
    sortBy = PostsSortBy.CreatedAt;
}
