import { InjectModel } from '@nestjs/mongoose';
import { UserEntity, UserModelType } from '../../domain/user.entity';
import { DeletionStatus } from '@libs/contracts/enums/deletion-status.enum';
import { PaginatedBlogViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { GetUsersQueryParams } from '../../dto/api/get-users-query-params.input-dto';
import { UserViewDto } from '../../dto/api/user-view.dto';
import { Injectable } from '@nestjs/common';
import { getUsersQuery } from '../../../../core/utils/user/query.insert.get';

@Injectable()
export class UserQueryRepository {
    constructor(@InjectModel(UserEntity.name) private userModel: UserModelType) {}
    async findUser(userId: string): Promise<UserViewDto | void> {
        const result = await this.userModel.findOne({ _id: userId });
        if (!result) {
            return void 0;
        }
        return UserViewDto.mapToView(result);
    }
    async getAllUsers(queryData: GetUsersQueryParams) {
        const { pageSize, pageNumber, searchLoginTerm, searchEmailTerm, sortBy, sortDirection } = getUsersQuery(queryData);

        const filter: any = {};

        if (searchLoginTerm) {
            filter.name = { $regex: searchLoginTerm, $options: 'i' };
        }

        if (searchEmailTerm) {
            filter.name = { $regex: searchEmailTerm, $options: 'i' };
        }

        const usersFromDb = await this.userModel
            .find({ ...filter, deletionStatus: DeletionStatus.enum['not-deleted'] })
            .skip(GetUsersQueryParams.calculateSkip(queryData))
            .limit(pageSize)
            .sort({ [sortBy]: sortDirection });

        const usersView = usersFromDb.map(user => UserViewDto.mapToView(user));

        const usersCount = await this.getUsersCount(searchLoginTerm || searchEmailTerm || null);

        return PaginatedBlogViewDto.mapToView({
            items: usersView,
            page: pageNumber,
            size: pageSize,
            totalCount: usersCount,
        });
    }

    private async getUsersCount(searchTerm: string | null): Promise<number> {
        const filter: any = { deletionStatus: DeletionStatus.enum['not-deleted'] };

        if (searchTerm) {
            filter.name = { $regex: searchTerm, $options: 'i' };
        }

        return await this.userModel.countDocuments(filter);
    }
}
