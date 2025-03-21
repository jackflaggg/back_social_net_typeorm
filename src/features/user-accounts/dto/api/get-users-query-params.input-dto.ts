import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseSortablePaginationParams } from '../../../../core/dto/base.query-params.input-dto';
import { UsersSortByEnum, UsersSortByValues } from '../../../../libs/contracts/enums/user/user.sort.by.enum';

export class GetUsersQueryParams extends BaseSortablePaginationParams<UsersSortByEnum> {
    @IsEnum(UsersSortByValues)
    sortBy = UsersSortByValues[0];

    @IsString()
    @IsOptional()
    searchLoginTerm: string | null = null;

    @IsString()
    @IsOptional()
    searchEmailTerm: string | null = null;
}
