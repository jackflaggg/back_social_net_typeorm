import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, UserEntity, UserModelType } from '../../domain/user/user.entity';
import { Injectable } from '@nestjs/common';
import { NotFoundDomainException } from '../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { DeletionStatus } from 'libs/contracts/enums/deletion-status.enum';

@Injectable()
export class UserRepository {
    constructor(@InjectModel(UserEntity.name) private userModel: UserModelType) {}

    async findUserByIdOrFail(userId: string) {
        const user = await this.userModel.findById({ _id: userId, deletionStatus: DeletionStatus.enum['not-deleted'] });
        if (!user) {
            throw NotFoundDomainException.create('User not found');
        }
        return user;
    }
    async findUserByRefreshToken(userId: string) {
        const user = await this.userModel.findById({ _id: userId, deletionStatus: DeletionStatus.enum['not-deleted'] });
        if (!user) {
            return void 0;
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
        const findUser = await this.userModel.findOne({ ...filter, deletionStatus: DeletionStatus.enum['not-deleted'] });
        if (!findUser) {
            return void 0;
        }
        return findUser;
    }

    async findUserCode(code: string) {
        const user = await this.userModel.findOne({
            'emailConfirmation.confirmationCode': code,
            deletionStatus: DeletionStatus.enum['not-deleted'],
        });
        if (!user) {
            return void 0;
        }
        return user;
    }

    async updateUserToEmailConf(id: string) {
        const updateEmail = await this.userModel.updateOne(
            { _id: id, deletionStatus: DeletionStatus.enum['not-deleted'] },
            {
                $set: {
                    'emailConfirmation.confirmationCode': '+',
                    'emailConfirmation.isConfirmed': true,
                },
            },
        );

        return updateEmail.matchedCount === 1;
    }

    async updateUserToCodeAndDate(userId: string, code: string, expirationDate: Date) {
        const updateEmail = await this.userModel.updateOne(
            { _id: userId, deletionStatus: DeletionStatus.enum['not-deleted'] },
            {
                $set: {
                    'emailConfirmation.confirmationCode': code,
                    'emailConfirmation.expirationDate': expirationDate,
                    'emailConfirmation.isConfirmed': false,
                },
            },
        );

        return updateEmail.matchedCount === 1;
    }
}
