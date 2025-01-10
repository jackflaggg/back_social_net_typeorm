import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DeletionStatus, DeletionStatusType } from '@libs/contracts/enums/deletion-status.enum';
import { HydratedDocument, Model } from 'mongoose';

export interface CommentatorInfoInterface {
    userId: string;
    userLogin: string;
}

@Schema({ timestamps: true })
export class CommentEntity {
    @Prop({ type: String, required: true })
    content: string;

    @Prop({ type: String, required: true })
    commentatorInfo: CommentatorInfoInterface;

    @Prop({ type: Date })
    createdAt: Date;

    @Prop({ type: String, required: true })
    postId: string;

    @Prop({ type: Number, required: true, default: 0 })
    likesCount: number;

    @Prop({ type: Number, required: true, default: 0 })
    dislikesCount: number;

    @Prop({ type: String, required: true, default: DeletionStatus.enum['not-deleted'] })
    deletionStatus: DeletionStatusType;

    public static buildInstance(dto: any): CommentDocument {
        const comment = new this();
        return comment as CommentDocument;
    }

    makeDeleted() {
        this.deletionStatus = DeletionStatus.enum['permanent-deleted'];
    }

    update(dto: any) {}
}

// Создает схему для сущности коммента и загружает её в базу данных
export const CommentSchema = SchemaFactory.createForClass(CommentEntity);

// Загружает методы из класса CommentEntity в схему
CommentSchema.loadClass(CommentEntity);

// Определяет тип для документа коммента, который будет содержать
// свойства и методы из Mongoose, а также будет типизирован
export type CommentDocument = HydratedDocument<CommentEntity>;

// тип модели, которая включает в себя все методы и свойства класса
export type CommentModelType = Model<CommentDocument> & typeof CommentEntity;
