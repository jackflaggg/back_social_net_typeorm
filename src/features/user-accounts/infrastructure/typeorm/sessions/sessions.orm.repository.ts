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
        const query = `
            SELECT "id", "device_id" as "deviceId", "issued_at" as "issuedAt", "user_id" AS "userId" FROM "security_device"  
            WHERE "device_id" = $1 AND "deleted_at" IS NULL
        `;
        const result = await this.dataSource.query(query, [deviceId]);
        if (!result) {
            return void 0;
        }
        return result;
    }

    async removeOldSession(idOnSession: string) {
        const deletedAt = new Date().toISOString();
        const query = `
            UPDATE "security_device"
            SET "deleted_at" = $1
            WHERE "id" = $2`;
        return await this.dataSource.query(query, [deletedAt, idOnSession]);
    }

    async deleteAllSessions(userId: string, deviceId: string) {
        const issuedAt = new Date().toISOString();
        const query = `
            UPDATE "security_device"
            SET "deleted_at" = $1
            WHERE "device_id" <> $2 AND "user_id" = $3;`;
        return await this.dataSource.query(query, [issuedAt, deviceId, userId]);
    }
}
