import { BaseSortablePaginationParams } from '../../../../../core/dto/base.query-params.input-dto';
import { BlogSortByEnum, BlogSortByValues } from '../../../../../libs/contracts/enums/blog/blog.sort.by.enum';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { publishedStatus, publishedStatusByValues } from '../../../../../libs/contracts/enums/quiz/published.status';
import { questionSortByValues } from '../../../../../libs/contracts/enums/quiz/question.sort.by';

export class GetQuestionsQueryParams extends BaseSortablePaginationParams<BlogSortByEnum> {
    @IsEnum(questionSortByValues)
    sortBy = BlogSortByValues[0];

    @IsString()
    @IsOptional()
    bodySearchTerm: string | null = null;

    @IsEnum(publishedStatusByValues)
    publishedStatus: string = publishedStatus.enum['all'];
}
