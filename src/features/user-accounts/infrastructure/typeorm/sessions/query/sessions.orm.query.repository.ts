import { Injectable } from '@nestjs/common';
import { deviceIntInterface, DeviceViewDto } from '../../../../dto/repository/device-view.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SecurityDeviceToUser } from '../../../../domain/typeorm/device/device.entity';

@Injectable()
export class SessionQueryRepositoryOrm {
    constructor(@InjectRepository(SecurityDeviceToUser) private sessionsRepositoryTypeOrm: Repository<SecurityDeviceToUser>) {}

    async getSessions(userId: string): Promise<DeviceViewDto[] | void> {
        const query = `
        SELECT "device_id" AS "deviceId", "device_name" AS "deviceName", "ip", "issued_at" AS "issuedAt" FROM "security_device" WHERE "deleted_at" IS NULL AND "user_id" = $1`;
        const result = await this.dataSource.query(query, [userId]);
        return result ? result.map((elem: deviceIntInterface) => DeviceViewDto.mapToView(elem)) : [];
    }
}
