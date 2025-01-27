import { DeviceDocument } from '../../domain/device/device.entity';

export class DeviceViewDto {
    ip: string;
    title: string;
    lastActiveDate: Date;
    deviceId: string;

    constructor(model: DeviceDocument) {
        this.ip = model.ip;
        this.title = model.deviceName;
        this.lastActiveDate = model.lastActiveDate || new Date(0);
        this.deviceId = model.deviceId;
    }

    static mapToView(device: DeviceDocument): DeviceViewDto {
        return new DeviceViewDto(device);
    }
}
