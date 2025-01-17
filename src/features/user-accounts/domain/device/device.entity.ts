import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'node:crypto';
import { HydratedDocument, Model } from 'mongoose';

@Schema({ timestamps: false })
export class DeviceEntity {
    @Prop({
        type: 'UUID',
        required: true,
        default: () => randomUUID(),
    })
    deviceId: string;

    @Prop({ type: String, required: true })
    userId: string;

    @Prop({ type: String, required: true })
    ip: string;

    @Prop({ type: String, required: true })
    lastActiveDate: Date;

    @Prop({ type: String, required: true })
    deviceName: string;

    @Prop({ type: String, required: true })
    refreshToken: string;
}

export const DeviceSchema = SchemaFactory.createForClass(DeviceEntity);

DeviceSchema.loadClass(DeviceEntity);

export type DeviceDocument = HydratedDocument<DeviceEntity>;

export type DeviceModelType = Model<DeviceDocument> & typeof DeviceEntity;
