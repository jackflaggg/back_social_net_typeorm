import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { DeletionStatus } from '@libs/contracts/enums/deletion-status.enum';
import {
    contentConstraints,
    shortDescriptionConstraints,
    titleConstraints,
} from '@libs/contracts/constants/post/post-property.constraints';

@Schema({ timestamps: true })
export class PostEntity {
    @Prop({ type: String, required: true, ...titleConstraints })
    title: string;

    @Prop({ type: String, required: true, ...shortDescriptionConstraints })
    shortDescription: string;

    @Prop({ type: String, required: true, ...contentConstraints })
    content: string;

    @Prop({ type: Date })
    createdAt: Date;

    @Prop({ type: String, required: true })
    deletionStatus: string;

    @Prop({ type: Boolean, required: false, default: false })
    isMembership: boolean;

    public static buildInstance(dto: any) {
        const post = new this();
        console.log(post);
        post.title = dto.title;
        post.shortDescription = dto.shortDescription;
        post.content = dto.content;
        return post as PostDocument;
    }

    makeDeleted() {
        this.deletionStatus = DeletionStatus['permanent-deleted'];
    }

    update(dto: any) {
        this.title = dto.title;
        this.shortDescription = dto.shortDescription;
        this.content = dto.content;
    }
}
// Создает схему для сущности блога и загружает её в базу данных
export const PostSchema = SchemaFactory.createForClass(PostEntity);

// Загружает методы из класса BlogEntity в схему
PostSchema.loadClass(PostEntity);

// Определяет тип для документа блога, который будет содержать
// свойства и методы из Mongoose, а также будет типизирован
export type PostDocument = HydratedDocument<PostEntity>;

// тип модели, которая включает в себя все методы и свойства класса
export type PostModelType = Model<PostDocument> & typeof PostEntity;
