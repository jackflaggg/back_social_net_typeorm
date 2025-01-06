import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { BlogCreateDto } from '../dto/blog.create.dto';
import { DeletionStatus } from '../../../../core/dto/deletion.status.dto';
import { BlogUpdateDto } from '../dto/blog.update.dto';

export const nameConstraints = {
    minLength: 1,
    maxLength: 15,
};

export const descriptionConstraints = {
    minLength: 1,
    maxLength: 500,
};

export const websiteUrlConstraints = {
    minLength: 1,
    maxLength: 100,
};

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

    @Prop({ type: String, required: true, default: DeletionStatus.NotDeleted })
    deletionStatus: DeletionStatus;

    public static buildInstance(dto: BlogCreateDto) {
        const blog = new this();
        console.log(blog);
        blog.name = dto.name;
        blog.description = dto.description;
        blog.websiteUrl = dto.websiteUrl;
        return blog as BlogDocument;
    }

    protected makeDeleted() {
        this.deletionStatus = DeletionStatus.PermanentDeleted;
    }

    protected update(dto: BlogUpdateDto) {
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
// свойства и методы из Mongoose, а также будет типизирован
export type BlogDocument = HydratedDocument<BlogEntity>;

// тип модели, которая включает в себя все методы и свойства класса
export type BlogModelType = Model<BlogDocument> & typeof BlogEntity;
