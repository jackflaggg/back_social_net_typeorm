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
}
