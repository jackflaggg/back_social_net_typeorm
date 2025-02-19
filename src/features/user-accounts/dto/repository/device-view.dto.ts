import { DeviceDocument } from '../../domain/device/device.entity';

export class DeviceViewDto {
    ip: string;
    title: string;
    deviceId: string;
    lastActiveDate: Date;

    constructor(model: DeviceDocument) {
        this.ip = model.ip;
        this.title = model.deviceName;
        this.lastActiveDate = model.issuedAt;
        this.deviceId = model.deviceId;
    }

    static mapToView(device: DeviceDocument): DeviceViewDto {
        return new DeviceViewDto(device);
    }
}

export function MappingDevice(ip: string, userAgent: string, deviceId: string, userId: string, dateDevice: Date) {
    return {
        issuedAt: dateDevice,
        deviceId,
        userId,
        ip,
        deviceName: userAgent,
    };
}
