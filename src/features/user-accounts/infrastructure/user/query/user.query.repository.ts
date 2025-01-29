import { InjectModel } from '@nestjs/mongoose';
import { UserEntity, UserModelType } from '../../../domain/user/user.entity';
import { DeletionStatus } from '@libs/contracts/enums/deletion-status.enum';
import { PaginatedBlogViewDto, PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { GetUsersQueryParams } from '../../../dto/api/get-users-query-params.input-dto';
import { UserViewDto } from '../../../dto/api/user-view.dto';
import { Injectable } from '@nestjs/common';
import { getUsersQuery } from '../../../../../core/utils/user/query.insert.get';
import { NotFoundDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';

@Injectable()
export class UserQueryRepository {
    constructor(@InjectModel(UserEntity.name) private userModel: UserModelType) {}
    async findUser(userId: string): Promise<UserViewDto | void> {
        const result = await this.userModel.findOne({ _id: userId, deletionStatus: DeletionStatus.enum['not-deleted'] });
        if (!result) {
            throw NotFoundDomainException.create('User not found', 'user');
        }
        return UserViewDto.mapToView(result);
    }
    async getAllUsers(queryData: GetUsersQueryParams): Promise<PaginatedViewDto<UserViewDto[]>> {
        const { sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm } = getUsersQuery(queryData);

        const filter = {
            $or: [
                searchLoginTerm ? { login: { $regex: searchLoginTerm, $options: 'i' } } : {},
                searchEmailTerm ? { email: { $regex: searchEmailTerm, $options: 'i' } } : {},
            ],
            deletionStatus: DeletionStatus.enum['not-deleted'],
        };

        const [usersFromDb, usersCount] = await Promise.all([
            this.userModel
                .find({ ...filter })
                .skip(GetUsersQueryParams.calculateSkip(queryData))
                .limit(pageSize)
                .sort({ [sortBy]: sortDirection }),
            this.userModel.countDocuments({ ...filter }),
        ]);

        const usersView = usersFromDb.map(user => UserViewDto.mapToView(user));

        return PaginatedBlogViewDto.mapToView<UserViewDto[]>({
            items: usersView,
            page: pageNumber,
            size: pageSize,
            totalCount: usersCount,
        });
    }
}
