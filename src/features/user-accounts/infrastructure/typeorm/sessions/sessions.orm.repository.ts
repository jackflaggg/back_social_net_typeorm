import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SecurityDeviceToUser } from '../../../domain/typeorm/device/device.entity';

@Injectable()
export class SessionsRepositoryOrm {
    constructor(@InjectRepository(SecurityDeviceToUser) private sessionsRepositoryTypeOrm: Repository<SecurityDeviceToUser>) {}
    async save(entity: SecurityDeviceToUser) {
        const result = await this.sessionsRepositoryTypeOrm.save(entity);
        return result.deviceId;
    }

    async findSessionByDeviceId(deviceId: string) {
        const result = await this.sessionsRepositoryTypeOrm
            .createQueryBuilder('s')
            .where('s.deleted_at IS NULL AND s.device_id = :deviceId', { deviceId })
            .getOne();
        if (!result) {
            return void 0;
        }
        return result;
    }

    async deleteAllSessions(userId: string, deviceId: string) {
        const issuedAt = new Date().toISOString();
        const query = `
            UPDATE "security_device"
            SET "deleted_at" = $1
            WHERE "device_id" <> $2 AND "user_id" = $3;`;
        return await this.sessionsRepositoryTypeOrm.query(query, [issuedAt, deviceId, userId]);
    }
}
