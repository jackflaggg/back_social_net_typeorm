import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseSortablePaginationParams } from '../../../../../../core/dto/base.query-params.input-dto';
import { BlogSortByEnum, BlogSortByValues } from '../../../../../../libs/contracts/enums/blog/blog.sort.by.enum';

export class GetBlogsQueryParams extends BaseSortablePaginationParams<BlogSortByEnum> {
    @IsEnum(BlogSortByValues)
    sortBy = BlogSortByValues[0];

    @IsString()
    @IsOptional()
    searchNameTerm: string | null = null;
}
