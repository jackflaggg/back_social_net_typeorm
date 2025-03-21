import { BlogUpdateDtoApi } from '../../dto/api/blog.update.dto';
import {
    descriptionConstraints,
    nameConstraints,
    websiteUrlConstraints,
} from '../../../../../libs/contracts/constants/blog/blog-property.constraints';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../../../core/domain/base.entity';
import { isNull } from '../../../../../core/utils/user/is.null';
import { BlogCreateRepositoryDto } from '../../application/usecases/create-blog.usecase';
import { Post } from '../../../posts/domain/typeorm/post.entity';

@Entity('blogs')
export class Blog extends BaseEntity {
    @Column({ name: 'title', type: 'varchar', length: nameConstraints.maxLength, collation: 'C' })
    name: string;

    @Column({ name: 'description', type: 'varchar', length: descriptionConstraints.maxLength, collation: 'C' })
    description: string;

    @Column({ name: 'website_url', type: 'varchar', length: websiteUrlConstraints.maxLength, collation: 'C' })
    websiteUrl: string;

    @Column({ name: 'is_membership', type: Boolean, default: false })
    isMembership: boolean;

    @OneToMany((): typeof Post => Post, post => post.blog)
    posts: Post[];

    public static buildInstance(dto: BlogCreateRepositoryDto): Blog {
        const blog = new this();

        blog.name = dto.name;
        blog.description = dto.description;
        blog.websiteUrl = dto.websiteUrl;
        blog.createdAt = dto.createdAt;

        return blog as Blog;
    }

    makeDeleted(): void {
        if (!isNull(this.deletedAt)) throw new Error('Данный объект уже был помечен на удаление');

        this.deletedAt = new Date();
    }

    update(dto: BlogUpdateDtoApi): void {
        this.name = dto.name;
        this.description = dto.description;
        this.websiteUrl = dto.websiteUrl;
    }
}
