import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { BlogCreateDtoApi } from '../../dto/api/blog.create.dto';
import { BlogUpdateDtoApi } from '../../dto/api/blog.update.dto';
import {
    descriptionConstraints,
    nameConstraints,
    websiteUrlConstraints,
} from '../../../../../libs/contracts/constants/blog/blog-property.constraints';
import { DeletionStatus, DeletionStatusType } from '../../../../../libs/contracts/enums/app/deletion-status.enum';

@Schema({ timestamps: true })
export class BlogEntity {
    @Prop({ type: String, required: true, ...nameConstraints })
    name: string;

    @Prop({ type: String, required: true, ...descriptionConstraints })
    description: string;

    @Prop({ type: String, required: true, ...websiteUrlConstraints })
    websiteUrl: string;

    @Prop({ type: Date })
    createdAt: Date;

    @Prop({ type: String, required: true, default: DeletionStatus.enum['not-deleted'] })
    deletionStatus: DeletionStatusType;

    @Prop({ type: Boolean, required: false, default: false })
    isMembership: boolean;

    public static buildInstance(dto: BlogCreateDtoApi) {
        const blog = new this();
        blog.name = dto.name;
        blog.description = dto.description;
        blog.websiteUrl = dto.websiteUrl;
        return blog as BlogDocument;
    }

    makeDeleted() {
        this.deletionStatus = DeletionStatus.enum['permanent-deleted'];
    }

    update(dto: BlogUpdateDtoApi) {
        this.name = dto.name;
        this.description = dto.description;
        this.websiteUrl = dto.websiteUrl;
    }
}
// Создает схему для сущности блога и загружает её в базу данных
export const BlogSchema = SchemaFactory.createForClass(BlogEntity);

// Загружает методы из класса BlogEntity в схему
BlogSchema.loadClass(BlogEntity);

// Определяет тип для документа блога, который будет содержать
// свойства и методы из Mongoose, а также будет типизирован.
export type BlogDocument = HydratedDocument<BlogEntity>;

// тип модели, которая включает в себя все методы и свойства класса
export type BlogModelType = Model<BlogDocument> & typeof BlogEntity;
