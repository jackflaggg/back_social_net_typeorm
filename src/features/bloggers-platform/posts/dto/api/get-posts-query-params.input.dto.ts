import { BaseSortablePaginationParams } from '../../../../../core/dto/base.query-params.input-dto';
import { IsEnum } from 'class-validator';
import { PostSortByEnum, PostSortByValues } from '../../../../../libs/contracts/enums/post/post.sort.by.enum';

export class GetPostsQueryParams extends BaseSortablePaginationParams<PostSortByEnum> {
    @IsEnum(PostSortByValues)
    sortBy = PostSortByValues[0];
}
