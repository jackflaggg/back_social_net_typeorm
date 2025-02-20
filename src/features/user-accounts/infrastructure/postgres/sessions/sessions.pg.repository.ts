import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class SessionsPgRepository {
    constructor(@InjectDataSource() protected dataSource: DataSource) {}
    async createSession(ip: string, userAgent: string, deviceId: string, userId: string, issuedAtRefreshToken: Date) {
        const query = `INSERT INTO "security_device" ("ip", "devicename", "userid", "deviceid", "issuedat") VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const result = await this.dataSource.query(query, [ip, userAgent, +userId, deviceId, issuedAtRefreshToken.toISOString()]);
        if (!result || result.length === 0) {
            return void 0;
        }
        return result[0];
    }

    async findSessionByDeviceId(deviceId: string) {
        const query = `
            SELECT "id", "deviceid" as "deviceId" FROM "security_device"  
            WHERE "deviceid" = $1 AND "deletedat" IS NULL
        `;
        const result = await this.dataSource.query(query, [deviceId]);
        if (!result || result.length === 0) {
            return void 0;
        }
        return result[0];
    }

    async deleteSession(deviceId: string) {
        const query = `
        SELECT * FROM "security_device"
        WHERE id = $1
        `;
        return await this.dataSource.query(query, [deviceId]);
    }

    async deleteAllSessions(userId: string, deviceId: string) {
        const issuedAt = new Date().toISOString();
        const query = `
            UPDATE "security_device"
            SET "deletedat" = $1
            WHERE "deviceid" <> $2 AND "userid" = $3;`;
        return await this.dataSource.query(query, [issuedAt, deviceId, userId]);
    }

    async updateSession(issuedAt: string, deviceId: string) {}
}
