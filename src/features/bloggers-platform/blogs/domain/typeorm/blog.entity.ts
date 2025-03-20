import { BlogCreateDtoApi } from '../../dto/api/blog.create.dto';
import { BlogUpdateDtoApi } from '../../dto/api/blog.update.dto';
import { nameConstraints } from '../../../../../libs/contracts/constants/blog/blog-property.constraints';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../../../core/domain/base.entity';
import { isNull } from '../../../../../core/utils/user/is.null';
import { BlogCreateRepositoryDto } from '../../application/usecases/create-blog.usecase';

@Entity('blogs')
export class Blog extends BaseEntity {
    @Column({ name: 'title', type: 'varchar', length: nameConstraints.maxLength, collation: 'C' })
    name: string;

    @Column({ name: 'description', type: 'varchar', length: '510', collation: 'C' })
    description: string;

    @Column({ name: 'website_url', type: 'varchar', length: '120', collation: 'C' })
    websiteUrl: string;

    @Column({ name: 'is_membership', type: Boolean, default: false })
    isMembership: boolean;

    public static buildInstance(dto: BlogCreateRepositoryDto) {
        const blog = new this();
        blog.name = dto.name;
        blog.description = dto.description;
        blog.websiteUrl = dto.websiteUrl;
        blog.createdAt = dto.createdAt;
        return blog;
    }

    makeDeleted() {
        if (!isNull(this.deletedAt)) throw new Error('Entity already deleted');

        this.deletedAt = new Date();
    }

    update(dto: BlogUpdateDtoApi) {
        this.name = dto.name;
        this.description = dto.description;
        this.websiteUrl = dto.websiteUrl;
    }
}
