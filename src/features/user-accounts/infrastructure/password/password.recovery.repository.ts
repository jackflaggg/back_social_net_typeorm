import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PasswordRecoveryEntity, PasswordRecoveryModelType } from '../../domain/password-recovery/password-recovery.entity';
import { DeletionStatus } from '../../../../libs/contracts/enums/deletion-status.enum';

@Injectable()
export class PasswordRecoveryDbRepository {
    constructor(@InjectModel(PasswordRecoveryEntity.name) private readonly passwordRecoveryEntity: PasswordRecoveryModelType) {}
    async findRecoveryCodeUser(code: string) {
        const findUser = await this.passwordRecoveryEntity.findOne({
            recoveryCode: code,
            deletionStatus: DeletionStatus.enum['not-deleted'],
        });

        if (!findUser) {
            return;
        }

        return findUser;
    }

    async updateStatus(id: string) {
        const updateDate = await this.passwordRecoveryEntity.updateOne(
            { _id: id, deletionStatus: DeletionStatus.enum['not-deleted'] },
            { $set: { used: true } },
        );
        return updateDate.modifiedCount === 1;
    }

    async createCodeAndDateConfirmation(userId: string, code: string, expirationDate: Date | string | null) {
        return await this.passwordRecoveryEntity.create({ userId, recoveryCode: code, expirationDate });
    }
}
