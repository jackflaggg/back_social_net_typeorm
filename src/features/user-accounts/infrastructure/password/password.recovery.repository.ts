import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PasswordRecoveryEntity, PasswordRecoveryModelType } from '../../domain/password-recovery/password-recovery.entity';

@Injectable()
export class PasswordRecoveryDbRepository {
    constructor(@InjectModel(PasswordRecoveryEntity.name) private readonly passwordRecoveryEntity: PasswordRecoveryModelType) {}
    async findRecoveryCodeUser(code: string) {
        const findUser = await this.passwordRecoveryEntity.findOne({
            recoveryCode: code,
        });

        if (!findUser) {
            return;
        }

        return findUser;
    }

    async updateStatus(id: string) {
        const updateDate = await this.passwordRecoveryEntity.updateOne({ _id: id }, { $set: { used: true } });
        return updateDate.modifiedCount === 1;
    }

    async createCodeAndDateConfirmation(userId: string, code: string, expirationDate: Date | string | null) {
        const pass = await this.passwordRecoveryEntity.create({ userId, recoveryCode: code, expirationDate });
        return pass;
    }
}
