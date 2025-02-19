import { Injectable } from '@nestjs/common';
import { DeviceViewDto } from '../../../../dto/repository/device-view.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class SessionQueryPgRepository {
    constructor(@InjectDataSource() protected dataSource: DataSource) {}

    async getSessions(userId: string): Promise<DeviceViewDto[] | void> {
        const query = `
        SELECT * FROM "security_device" WHERE "deletedat" IS NULL AND "userid" = $1`;
        const result = await this.dataSource.query(query, [userId]);
        return result ? result.map(elem => DeviceViewDto.mapToView(elem)) : [];
    }
}
