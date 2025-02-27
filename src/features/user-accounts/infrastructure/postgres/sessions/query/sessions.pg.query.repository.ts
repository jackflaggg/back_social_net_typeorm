import { Injectable } from '@nestjs/common';
import { deviceIntInterface, DeviceViewDto } from '../../../../dto/repository/device-view.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class SessionQueryPgRepository {
    constructor(@InjectDataSource() protected dataSource: DataSource) {}

    async getSessions(userId: string): Promise<DeviceViewDto[] | void> {
        const query = `
        SELECT "device_id" AS "deviceId", "device_name" AS "deviceName", "ip", "issued_at" AS "issuedAt" FROM "security_device" WHERE "deleted_at" IS NULL AND "user_id" = $1`;
        const result = await this.dataSource.query(query, [userId]);
        return result ? result.map((elem: deviceIntInterface) => DeviceViewDto.mapToView(elem)) : [];
    }
}
