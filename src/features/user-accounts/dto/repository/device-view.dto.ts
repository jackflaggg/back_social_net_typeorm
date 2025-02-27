export interface deviceIntInterface {
    ip: string;
    deviceName: string;
    deviceId: string;
    issuedAt: Date;
}

export class DeviceViewDto {
    ip: string;
    title: string;
    deviceId: string;
    lastActiveDate: Date;

    constructor(model: deviceIntInterface) {
        this.ip = model.ip;
        this.title = model.deviceName;
        this.lastActiveDate = model.issuedAt;
        this.deviceId = model.deviceId;
    }

    static mapToView(device: deviceIntInterface): DeviceViewDto {
        return new DeviceViewDto(device);
    }
}
