import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseSortablePaginationParams } from '../../../../../../core/dto/base.query-params.input-dto';
import { BlogsSortBy } from './blogs-sort-by';

export class GetBlogsQueryParams extends BaseSortablePaginationParams<BlogsSortBy> {
    @IsEnum(BlogsSortBy)
    sortBy = BlogsSortBy.CreatedAt;

    @IsString()
    @IsOptional()
    searchNameTerm: string | null = null;
}
