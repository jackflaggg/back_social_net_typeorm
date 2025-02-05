import { DeletionStatus, DeletionStatusType } from 'libs/contracts/enums/deletion-status.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { contentConstraints, shortDescriptionConstraints, titleConstraints } from 'libs/contracts/constants/post/post-property.constraints';
import { HydratedDocument, Model } from 'mongoose';
import { ExtendedLikesEntity, ExtendedLikesSchema } from './extended.like.entity';
import { defaultLike } from 'libs/contracts/constants/post/default.like.schema';
import { PostUpdateDtoService } from '../dto/service/post.update.dto';
import { PostToBlogCreateDtoApi } from '../../blogs/dto/api/blog.to.post.create.dto';

@Schema({ timestamps: true })
export class PostEntity {
    @Prop({ type: String, required: true, ...titleConstraints })
    title: string;

    @Prop({ type: String, required: true, ...shortDescriptionConstraints })
    shortDescription: string;

    @Prop({ type: String, required: true, ...contentConstraints })
    content: string;

    @Prop({ type: String, required: true, ref: 'Blog' })
    blogId: string;

    @Prop({ type: String, required: true })
    blogName: string;

    @Prop({ type: Date })
    createdAt: Date;

    @Prop({ type: String, required: true, default: DeletionStatus.enum['not-deleted'] })
    deletionStatus: DeletionStatusType;

    @Prop({
        type: ExtendedLikesSchema,
        required: true,
        default: defaultLike,
    })
    extendedLikesInfo: ExtendedLikesEntity;

    static buildInstance(dto: PostToBlogCreateDtoApi, blogId: string, blogName: string): PostDocument {
        const post = new this();

        post.title = dto.title;
        post.shortDescription = dto.shortDescription;
        post.content = dto.content;
        post.blogId = blogId;
        post.blogName = blogName;

        return post as PostDocument;
    }

    update(dto: PostUpdateDtoService): void {
        this.title = dto.title;
        this.shortDescription = dto.shortDescription;
        this.content = dto.content;
    }

    makeDeleted(): void {
        this.deletionStatus = DeletionStatus.enum['permanent-deleted'];
    }
}

export const PostSchema = SchemaFactory.createForClass(PostEntity);

PostSchema.loadClass(PostEntity);

export type PostDocument = HydratedDocument<PostEntity>;

export type PostModelType = Model<PostDocument> & typeof PostEntity;
