import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class SessionsPgRepository {
    constructor(@InjectDataSource() protected datasource: DataSource) {}
    async createSession(ip: string, userAgent: string, deviceId: string, userId: string, issuedAtRefreshToken: Date) {
        const query = `INSERT INTO "security_device" ("ip", "devicename", "userid", "deviceid", "issuedat") VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const result = await this.datasource.query(query, [ip, userAgent, +userId, deviceId, issuedAtRefreshToken.toISOString()]);
        if (!result || result.length === 0) {
            return void 0;
        }
        return result[0];
    }

    async findSessionById(deviceId: string) {
        const query = `
            SELECT * FROM "security_device"  
            WHERE "deviceid" = $1 AND "deletedat" IS NULL
        `;
        const result = await this.dataSource.query(query, [deviceId]);
        if (!result || result.length === 0) {
            return void 0;
        }
        return result[0];
    }
}
