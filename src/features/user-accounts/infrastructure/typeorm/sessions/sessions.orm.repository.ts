import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class SessionsRepositoryOrm {
    constructor(@InjectDataSource() protected dataSource: DataSource) {}
    async createSession(ip: string, userAgent: string, deviceId: string, userId: string, issuedAtRefreshToken: Date) {
        const query = `INSERT INTO "security_device" ("ip", "device_name", "user_id", "device_id", "issued_at") VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const result = await this.dataSource.query(query, [ip, userAgent, +userId, deviceId, issuedAtRefreshToken.toISOString()]);
        if (!result) {
            return void 0;
        }
        return result;
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
