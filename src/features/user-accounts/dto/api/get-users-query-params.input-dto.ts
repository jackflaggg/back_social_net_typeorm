import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseSortablePaginationParams } from '../../../../core/dto/base.query-params.input-dto';
import { UsersSortBy } from './user-sort.query';

export class GetUsersQueryParams extends BaseSortablePaginationParams<UsersSortBy> {
    @IsEnum(UsersSortBy)
    sortBy = UsersSortBy.CreatedAt;

    @IsString()
    @IsOptional()
    searchLoginTerm: string | null = null;

    @IsString()
    @IsOptional()
    searchEmailTerm: string | null = null;
}
