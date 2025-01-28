import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeviceDocument, DeviceEntity, DeviceModelType } from '../../domain/device/device.entity';

@Injectable()
export class SessionRepository {
    constructor(@InjectModel(DeviceEntity.name) private deviceModel: DeviceModelType) {}
    async save(device: DeviceDocument) {
        await device.save();
    }
}
