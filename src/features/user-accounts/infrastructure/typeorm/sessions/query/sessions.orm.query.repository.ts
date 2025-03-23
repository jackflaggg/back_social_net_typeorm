import { Injectable } from '@nestjs/common';
import { deviceIntInterface, DeviceViewDto } from '../../../../dto/repository/device-view.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SecurityDeviceToUser } from '../../../../domain/typeorm/device/device.entity';

@Injectable()
export class SessionQueryRepositoryOrm {
    constructor(@InjectRepository(SecurityDeviceToUser) private sessionsRepositoryTypeOrm: Repository<SecurityDeviceToUser>) {}

    async getSessions(userId: string): Promise<DeviceViewDto[] | void> {
        const result = await this.sessionsRepositoryTypeOrm
            .createQueryBuilder('s')
            .select('s.device_id AS "deviceId", s.device_name AS "deviceName", s.ip AS ip, s.issued_at AS "issuedAt"')
            .where('deleted_at IS NULL AND user_id = :userId', { userId })
            .getRawMany();
        return result ? result.map((elem: deviceIntInterface) => DeviceViewDto.mapToView(elem)) : [];
    }
}
