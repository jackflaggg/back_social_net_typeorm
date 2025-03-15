import { PostUpdateDtoService } from '../../dto/service/post.update.dto';
import { PostToBlogCreateDtoApi } from '../../../blogs/dto/api/blog.to.post.create.dto';
import { BaseEntity } from '../../../../../core/domain/base.entity';
import { Column, CreateDateColumn, Entity } from 'typeorm';
import { isNull } from '../../../../../core/utils/user/is.null';

@Entity('posts')
export class Post extends BaseEntity {
    @Column({ name: 'title', type: 'varchar', length: '30', collation: 'C' })
    title: string;

    @Column({ name: 'short_description', type: 'varchar', length: '255', collation: 'C' })
    shortDescription: string;

    @Column({ name: 'content', type: 'varchar', length: '255', collation: 'C' })
    content: string;

    @Column({ name: 'blog_id', type: 'varchar' })
    blogId: string;

    @CreateDateColumn({ name: 'updated_business_logic', type: 'timestamptz', default: null })
    updatedBusLogic: Date | null;

    static buildInstance(dto: PostToBlogCreateDtoApi, blogId: string, blogName: string) {
        const post = new this();

        post.title = dto.title;
        post.shortDescription = dto.shortDescription;
        post.content = dto.content;
        post.blogId = blogId;

        return post;
    }

    update(dto: PostUpdateDtoService): void {
        this.title = dto.title;
        this.shortDescription = dto.shortDescription;
        this.content = dto.content;
    }

    markDeleted(): void {
        if (!isNull(this.deletedAt)) throw new Error('Entity already deleted');
        this.deletedAt = new Date();
        this.updatedBusLogic = new Date();
    }
}
