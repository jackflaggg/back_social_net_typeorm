import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DeletionStatus, DeletionStatusType } from '@libs/contracts/enums/deletion-status.enum';
import { HydratedDocument, Model } from 'mongoose';
import { ExtendedLikesSchema } from '../../posts/domain/extended.like.entity';
import { defaultLike } from '@libs/contracts/constants/post/default.like.schema';

export interface CommentatorInfoInterface {
    userId: string;
    userLogin: string;
}

export interface likesInfoInterface {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
}

@Schema({ timestamps: true })
export class CommentEntity {
    @Prop({ type: String, required: true })
    content: string;

    @Prop({ type: { userId: String, userLogin: String }, required: true })
    commentatorInfo: CommentatorInfoInterface;

    @Prop({ type: Date })
    createdAt: Date;

    @Prop({ type: String, required: true, ref: 'Post' })
    postId: string;

    @Prop({ type: ExtendedLikesSchema.omit(['newestLikes']), required: true, default: defaultLike })
    likesInfo: likesInfoInterface;

    @Prop({ type: String, required: true, default: DeletionStatus.enum['not-deleted'] })
    deletionStatus: DeletionStatusType;

    public static buildInstance(content: string, commentatorInfo: CommentatorInfoInterface, postId: string): CommentDocument {
        const comment = new this();
        comment.content = content;
        comment.commentatorInfo = {
            userId: commentatorInfo.userId,
            userLogin: commentatorInfo.userLogin,
        };
        comment.postId = postId;
        comment.likesInfo.dislikesCount = 0;
        comment.likesInfo.likesCount = 0;
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
