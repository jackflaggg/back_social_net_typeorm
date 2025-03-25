import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecoveryPasswordToUser } from '../../../domain/typeorm/password-recovery/pass-rec.entity';

@Injectable()
export class PasswordRecoveryRepositoryOrm {
    constructor(@InjectRepository(RecoveryPasswordToUser) private recPassRepositoryTypeOrm: Repository<RecoveryPasswordToUser>) {}
    async findCode(code: string) {
        const result = await this.recPassRepositoryTypeOrm.createQueryBuilder('rec').where('rec.recovery_code = :code', { code }).getOne();
        if (!result) {
            return void 0;
        }
        return result;
    }
    async createRecoveryPassword(dto: any, userId: string) {
        const result = RecoveryPasswordToUser.buildInstance(dto, userId);
        return this.saveRecoveryPassword(result);
    }
    private async saveRecoveryPassword(entity: RecoveryPasswordToUser) {
        await this.recPassRepositoryTypeOrm.save(entity);
    }
    async updateRecoveryPassword(entity: RecoveryPasswordToUser) {
        entity.updateStatus();
        return this.saveRecoveryPassword(entity);
    }
}
