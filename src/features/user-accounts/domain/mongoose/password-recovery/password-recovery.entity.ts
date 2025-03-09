import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

@Schema()
export class PasswordRecoveryEntity {
    @Prop({ type: String, required: true })
    userId: string;

    @Prop({ type: String, required: true })
    recoveryCode: string;

    @Prop({ type: Date, required: true })
    expirationDate: Date;

    @Prop({ type: Boolean, required: true, default: false })
    used: boolean;
}

export const PasswordRecoverySchema = SchemaFactory.createForClass(PasswordRecoveryEntity);

PasswordRecoverySchema.loadClass(PasswordRecoveryEntity);

export type PasswordRecoveryDocument = HydratedDocument<PasswordRecoveryEntity>;

export type PasswordRecoveryModelType = Model<PasswordRecoveryDocument> & typeof PasswordRecoveryEntity;
