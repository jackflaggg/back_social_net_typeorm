import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeviceDocument, DeviceEntity, DeviceModelType } from '../../domain/device/device.entity';
import { UserJwtPayloadDto } from '../../../../core/guards/passport/strategies/refresh.strategy';
import { DeletionStatus } from '@libs/contracts/enums/deletion-status.enum';

@Injectable()
export class SessionRepository {
    constructor(@InjectModel(DeviceEntity.name) private deviceModel: DeviceModelType) {}
    async save(device: DeviceDocument) {
        await device.save();
    }
    async findDeviceByToken(dto: UserJwtPayloadDto) {
        const issuedAt = new Date(dto.iat * 1000);
        const device = await this.deviceModel.findOne({
            deviceId: dto.deviceId,
            userId: dto.userId,
            deletionStatus: DeletionStatus.enum['not-deleted'],
            issuedAt,
        });
        if (!device) {
            return void 0;
        }
        return device;
    }
    async findDeviceById(deviceId: string) {
        const device = await this.deviceModel.findOne({ deviceId, deletionStatus: DeletionStatus.enum['not-deleted'] });
        if (!device) {
            return void 0;
        }
        return device;
    }
    async updateSession(id: string, issuedAtToken: Date, refreshToken: string) {
        const lastActiveDate = new Date();
        const updateDate = await this.deviceModel.findOneAndUpdate(
            {
                _id: id,
            },
            {
                issuedAt: issuedAtToken,
                lastActiveDate,
                refreshToken,
            },
        );
        return updateDate;
    }
}
