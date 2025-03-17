import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecoveryPasswordToUser } from '../../../domain/typeorm/password-recovery/pass-rec.entity';

@Injectable()
export class PasswordRecoveryRepositoryOrm {
    constructor(@InjectRepository(RecoveryPasswordToUser) private recPassRepositoryTypeOrm: Repository<RecoveryPasswordToUser>) {}
    async findCode(code: string) {
        const result = await this.recPassRepositoryTypeOrm
            .createQueryBuilder('rec')
            .where('rec.recovery_code = :code', { code })
            .getRawOne();
        if (!result) {
            return void 0;
        }
        return result;
    }
    async updateStatus(passwordId: string) {
        const query = `
            UPDATE "recovery_password" SET "used" = TRUE
            WHERE "id" = $1
        `;
        await this.recPassRepositoryTypeOrm.query(query, [Number(passwordId)]);
    }
    async createPasswordRecovery(userId: string, code: string, expirationDate: Date) {
        const query = `
            INSERT INTO "recovery_password"("user_id", recovery_code, recovery_expiration_date) VALUES($1, $2, $3)
        `;
        const result = await this.recPassRepositoryTypeOrm.query(query, [userId, code, expirationDate.toISOString()]);
        if (!result) {
            return void 0;
        }
        return result;
    }
}
