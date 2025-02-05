import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeviceDocument, DeviceEntity, DeviceModelType } from '../../domain/device/device.entity';
import { DeletionStatus } from '../../../../libs/contracts/enums/deletion-status.enum';

@Injectable()
export class SessionRepository {
    constructor(@InjectModel(DeviceEntity.name) private deviceModel: DeviceModelType) {}
    async save(device: DeviceDocument) {
        await device.save();
    }

    async findDeviceById(deviceId: string) {
        const device = await this.deviceModel.findOne({ deviceId, deletionStatus: DeletionStatus.enum['not-deleted'] });

        if (!device) {
            return void 0;
        }

        return device;
    }
    async deleteAllSession(userId: string, deviceId: string) {
        return this.deviceModel.updateMany(
            {
                userId,
                deviceId: { $ne: deviceId },
            },
            { deletionStatus: DeletionStatus.enum['permanent-deleted'] },
        );
    }
}
