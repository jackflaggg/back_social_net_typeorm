import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SecurityDeviceToUser } from '../../../domain/typeorm/device/device.entity';

@Injectable()
export class SessionsRepositoryOrm {
    constructor(@InjectRepository(SecurityDeviceToUser) private sessionsRepositoryTypeOrm: Repository<SecurityDeviceToUser>) {}
    async save(entity: SecurityDeviceToUser): Promise<string> {
        const result = await this.sessionsRepositoryTypeOrm.save(entity);
        return result.deviceId;
    }

    async findSessionByDeviceId(deviceId: string): Promise<SecurityDeviceToUser | void> {
        const result = await this.sessionsRepositoryTypeOrm
            .createQueryBuilder('s')
            .leftJoinAndSelect('s.user', 'user') // Добавляем это для загрузки пользователя
            .select(['s.deviceId', 's.deviceName', 's.ip', 's.issuedAt', 's.deletedAt', 'user.id'])
            .where('s.deleted_at IS NULL AND s.device_id = :deviceId', { deviceId })
            .getOne();
        if (!result) {
            return void 0;
        }
        return result;
    }

    async deleteAllSessions(userId: string, deviceId: string): Promise<void> {
        const issuedAt = new Date().toISOString();
        await this.sessionsRepositoryTypeOrm
            .createQueryBuilder()
            .update(SecurityDeviceToUser)
            .set({ deletedAt: issuedAt })
            .where('device_id <> :deviceId AND user_id = :userId', { deviceId, userId })
            .execute();
    }
}
