import { BaseSortablePaginationParams } from '../../../../../core/dto/base.query-params.input-dto';
import { IsEnum } from 'class-validator';
import { EntitiesSortByEnum, PostSortByValues } from '../../../../../libs/contracts/enums/post/entitiesSortByEnum';

export class GetPostsQueryParams extends BaseSortablePaginationParams<EntitiesSortByEnum> {
    @IsEnum(PostSortByValues)
    sortBy = PostSortByValues[0];
}
