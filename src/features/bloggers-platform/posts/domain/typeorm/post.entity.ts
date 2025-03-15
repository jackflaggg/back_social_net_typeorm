import { Prop, Schema } from '@nestjs/mongoose';
import { PostUpdateDtoService } from '../../dto/service/post.update.dto';
import { PostToBlogCreateDtoApi } from '../../../blogs/dto/api/blog.to.post.create.dto';
import {
    contentConstraints,
    shortDescriptionConstraints,
    titleConstraints,
} from '../../../../../libs/contracts/constants/post/post-property.constraints';
import { DeletionStatus, DeletionStatusType } from '../../../../../libs/contracts/enums/deletion-status.enum';

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

    static buildInstance(dto: PostToBlogCreateDtoApi, blogId: string, blogName: string) {
        const post = new this();

        post.title = dto.title;
        post.shortDescription = dto.shortDescription;
        post.content = dto.content;
        post.blogId = blogId;
        post.blogName = blogName;

        return post;
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
