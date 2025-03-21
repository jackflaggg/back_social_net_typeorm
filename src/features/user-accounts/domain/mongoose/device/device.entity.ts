import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { DeletionStatus, DeletionStatusType } from '../../../../../libs/contracts/enums/app/deletion-status.enum';

@Schema({ timestamps: false })
export class DeviceEntity {
    @Prop({
        type: String,
        required: true,
        //default: () => randomUUID(),
    })
    deviceId: string;

    @Prop({ type: Date, required: true })
    issuedAt: Date;

    @Prop({ type: String, required: true })
    userId: string;

    @Prop({ type: String, required: true })
    ip: string;

    @Prop({ type: String, required: true })
    deviceName: string;

    @Prop({ type: String, required: true, default: DeletionStatus.enum['not-deleted'] })
    deletionStatus: DeletionStatusType;

    public static buildInstance(dto: { deviceId: string; issuedAt: Date; userId: string; ip: string; deviceName: string }) {
        const session = new this();
        session.deviceId = dto.deviceId;
        session.issuedAt = dto.issuedAt;
        session.userId = dto.userId;
        session.ip = dto.ip;
        session.deviceName = dto.deviceName;
        return session as DeviceDocument;
    }

    makeDeleted() {
        this.deletionStatus = DeletionStatus.enum['permanent-deleted'];
    }
    updateSession(issuedAt: number, deviceId: string) {
        this.issuedAt = new Date(1000 * issuedAt);
        this.deviceId = deviceId;
    }
}

export const DeviceSchema = SchemaFactory.createForClass(DeviceEntity);

DeviceSchema.loadClass(DeviceEntity);

export type DeviceDocument = HydratedDocument<DeviceEntity>;

export type DeviceModelType = Model<DeviceDocument> & typeof DeviceEntity;
