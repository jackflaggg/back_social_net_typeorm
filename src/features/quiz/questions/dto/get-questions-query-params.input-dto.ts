import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseSortablePaginationParams } from '../../../../core/dto/base.query-params.input-dto';
import { ApiProperty } from '@nestjs/swagger';
import { PublishedStatus } from './questions-publishedStatus';
import { QuestionsSortBy } from './questions-sort-by';

export class GetQuestionsQueryParams extends BaseSortablePaginationParams<QuestionsSortBy> {
    @ApiProperty({ example: 'createdAt', description: 'Sort by createdAt', enum: QuestionsSortBy }) //swagger
    @IsEnum(QuestionsSortBy)
    sortBy = QuestionsSortBy.CreatedAt;

    @ApiProperty({ example: 'test', description: 'Search by body', type: String }) //swagger
    @IsString()
    @IsOptional()
    bodySearchTerm: string | null = null;

    @ApiProperty({ example: 'all', description: 'Published status', type: String, enum: PublishedStatus }) //swagger
    @IsEnum(PublishedStatus)
    @IsOptional()
    publishedStatus: PublishedStatus = PublishedStatus.All;
}
