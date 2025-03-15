import { Prop, Schema } from '@nestjs/mongoose';
import { BlogCreateDtoApi } from '../../dto/api/blog.create.dto';
import { BlogUpdateDtoApi } from '../../dto/api/blog.update.dto';
import {
    descriptionConstraints,
    nameConstraints,
    websiteUrlConstraints,
} from '../../../../../libs/contracts/constants/blog/blog-property.constraints';
import { DeletionStatus, DeletionStatusType } from '../../../../../libs/contracts/enums/deletion-status.enum';

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
        return blog;
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
