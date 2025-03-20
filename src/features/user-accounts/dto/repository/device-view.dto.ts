export interface deviceIntInterface {
    ip: string;
    devicename: string;
    deviceid: string;
    issuedat: Date;
}

export class DeviceViewDto {
    ip: string;
    title: string;
    deviceId: string;
    lastActiveDate: Date;

    constructor(model: deviceIntInterface) {
        this.ip = model.ip;
        this.title = model.devicename;
        this.lastActiveDate = model.issuedat;
        this.deviceId = model.deviceid;
    }

    static mapToView(device: deviceIntInterface): DeviceViewDto {
        return new DeviceViewDto(device);
    }
}
