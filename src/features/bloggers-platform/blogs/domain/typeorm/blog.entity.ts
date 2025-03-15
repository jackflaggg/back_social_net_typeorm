import { Prop, Schema } from '@nestjs/mongoose';
import { BlogCreateDtoApi } from '../../dto/api/blog.create.dto';
import { BlogUpdateDtoApi } from '../../dto/api/blog.update.dto';
import {
    descriptionConstraints,
    nameConstraints,
    websiteUrlConstraints,
} from '../../../../../libs/contracts/constants/blog/blog-property.constraints';
import { DeletionStatus, DeletionStatusType } from '../../../../../libs/contracts/enums/deletion-status.enum';
import { Column, CreateDateColumn, Entity } from 'typeorm';
import { BaseEntity } from '../../../../../core/domain/base.entity';
import { isNull } from '../../../../../core/utils/user/is.null';

@Entity('posts')
export class Blog extends BaseEntity {
    @Column({ name: 'title', type: 'varchar', collation: 'C', length: nameConstraints.maxLength })
    name: string;

    @Column({ name: 'title', type: 'varchar', collation: 'C' })
    description: string;

    @Column({ name: 'title', type: 'varchar', collation: 'C' })
    websiteUrl: string;

    @Column({ type: Boolean, default: false })
    isMembership: boolean;

    @CreateDateColumn({ name: 'updated_business_logic', type: 'timestamptz', default: null })
    updatedBusLogic: Date | null;

    public static buildInstance(dto: BlogCreateDtoApi) {
        const blog = new this();
        blog.name = dto.name;
        blog.description = dto.description;
        blog.websiteUrl = dto.websiteUrl;
        return blog;
    }

    makeDeleted() {
        if (!isNull(this.deletedAt)) throw new Error('Entity already deleted');

        this.deletedAt = new Date();
        this.updatedBusLogic = new Date();
    }

    update(dto: BlogUpdateDtoApi) {
        this.name = dto.name;
        this.description = dto.description;
        this.websiteUrl = dto.websiteUrl;
    }
}
