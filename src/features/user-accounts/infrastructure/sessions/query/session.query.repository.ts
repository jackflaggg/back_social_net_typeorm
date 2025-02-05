import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeviceEntity, DeviceModelType } from '../../../domain/device/device.entity';
import { DeviceViewDto } from '../../../dto/repository/device-view.dto';
import { DeletionStatus } from '../../../../../libs/contracts/enums/deletion-status.enum';

@Injectable()
export class SessionQueryRepository {
    constructor(@InjectModel(DeviceEntity.name) private deviceModel: DeviceModelType) {}

    async getSessions(userId: string): Promise<DeviceViewDto[] | void> {
        const session = await this.deviceModel.find({ userId, deletionStatus: DeletionStatus.enum['not-deleted'] }).lean();
        return session ? session.map(elem => DeviceViewDto.mapToView(elem)) : [];
    }
}
