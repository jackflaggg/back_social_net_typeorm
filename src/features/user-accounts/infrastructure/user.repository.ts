import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, UserEntity, UserModelType } from '../domain/user/user.entity';
import { Injectable } from '@nestjs/common';
import { NotFoundDomainException, UnauthorizedDomainException } from '../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { DeletionStatus } from '@libs/contracts/enums/deletion-status.enum';

@Injectable()
export class UserRepository {
    constructor(@InjectModel(UserEntity.name) private userModel: UserModelType) {}

    async findUserByIdOrFail(userId: string) {
        const user = await this.userModel.findById({ _id: userId });
        if (!user) {
            throw NotFoundDomainException.create('User not found');
            //return void 0;
        }
        return user;
    }
    async save(user: UserDocument): Promise<void> {
        await user.save();
    }

    async findUserByLoginOrEmail(loginOrEmail: string) {
        const filter = {
            $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
        };
        const findUser = await this.userModel.findOne(filter, { deletionStatus: DeletionStatus.enum['not-deleted'] }).lean();
        if (!findUser) {
            return void 0;
        }
        return findUser;
    }
}
