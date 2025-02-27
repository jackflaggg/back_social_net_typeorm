import { BaseSortablePaginationParams } from '../../../../../../core/dto/base.query-params.input-dto';
import { IsEnum } from 'class-validator';
import { CommentSortByEnum, CommentSortByValues } from '../../../../../../libs/contracts/enums/comment.sort.by.enum';

export class GetCommentsQueryParams extends BaseSortablePaginationParams<CommentSortByEnum> {
    @IsEnum(CommentSortByValues)
    sortBy = CommentSortByValues[0];
}
