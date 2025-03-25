import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SecurityDeviceToUser } from '../../../domain/typeorm/device/device.entity';
import { User } from '../../../domain/typeorm/user/user.entity';
import { DeviceCreateDto } from '../../../dto/repository/device.create.dto';

@Injectable()
export class SessionsRepositoryOrm {
    constructor(@InjectRepository(SecurityDeviceToUser) private sessionsRepositoryTypeOrm: Repository<SecurityDeviceToUser>) {}
    private async save(entity: SecurityDeviceToUser): Promise<string> {
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
    async createSession(dto: DeviceCreateDto, user: User) {
        const result = SecurityDeviceToUser.buildInstance(dto, user);
        await this.save(result);
    }

    async deleteSession(session: SecurityDeviceToUser) {
        session.markDeleted();
        await this.save(session);
    }
    async updateSession(session: SecurityDeviceToUser) {
        session.updateIssuedAt();
        await this.save(session);
    }
}
