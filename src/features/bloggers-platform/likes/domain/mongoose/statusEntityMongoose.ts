import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { StatusLike } from '../../../../../libs/contracts/enums/status/status.like';
import { likeViewModel } from '../../types/like.view';

@Schema({ timestamps: true, optimisticConcurrency: true }) // Добавлено optimisticConcurrency
export class StatusEntityMongoose {
    @Prop({ type: String, required: true, index: true })
    userId: string;

    @Prop({ type: String, required: true })
    userLogin: string;

    @Prop({ type: String, required: true, index: true })
    parentId: string;

    @Prop({ type: String, required: true, enum: StatusLike.enum, default: StatusLike.enum['None'] }) // Использование enum
    status: string;

    @Prop({ type: Date, required: true, default: Date.now })
    createdAt: Date;

    public static buildInstance(dto: likeViewModel): StatusDocument {
        const status = new this();
        status.userId = dto.userId;
        status.userLogin = dto.userLogin;
        status.parentId = dto.parentId;
        status.status = dto.status || StatusLike.enum['None']; // Установка значения по умолчанию, если не указано
        return status as StatusDocument;
    }
}

export const StatusSchema = SchemaFactory.createForClass(StatusEntityMongoose);

StatusSchema.loadClass(StatusEntityMongoose);

export type StatusDocument = HydratedDocument<StatusEntityMongoose>;

export type StatusModelType = Model<StatusDocument> & typeof StatusSchema;
