import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { ExtendedLikesSchema } from '../../../posts/domain/mongoose/extended.like.entity';
import { DeletionStatus, DeletionStatusType } from '../../../../../libs/contracts/enums/app/deletion-status.enum';
import { defaultLike } from '../../../../../libs/contracts/constants/post/default.like.schema';
import { CommentatorInfoInterface } from '../../types/commentator.info';
import { likesInfoInterface } from '../../types/likes.info';

@Schema({ timestamps: true })
export class CommentEntityMongoose {
    @Prop({ type: String, required: true })
    content: string;

    @Prop({ type: { userId: String, userLogin: String }, required: true, _id: false })
    commentatorInfo: CommentatorInfoInterface;

    @Prop({ type: Date })
    createdAt: Date;

    @Prop({ type: String, required: true, ref: 'Post' })
    postId: string;

    @Prop({ type: ExtendedLikesSchema.omit(['newestLikes', 'myStatus']), required: true, default: defaultLike })
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

    updateContent(content: string) {
        this.content = content;
    }
    updateStatus(likesCount: number, dislikesCount: number) {
        this.likesInfo.likesCount = likesCount;
        this.likesInfo.dislikesCount = dislikesCount;
    }
}

// Создает схему для сущности коммента и загружает её в базу данных
export const CommentSchema = SchemaFactory.createForClass(CommentEntityMongoose);

// Загружает методы из класса CommentSchema в схему
CommentSchema.loadClass(CommentEntityMongoose);

// Определяет тип для документа коммента, который будет содержать
// свойства и методы из Mongoose, а также будет типизирован
export type CommentDocument = HydratedDocument<CommentEntityMongoose>;

// тип модели, которая включает в себя все методы и свойства класса
export type CommentModelType = Model<CommentDocument> & typeof CommentSchema;
