import { PostUpdateDtoService } from '../../dto/service/post.update.dto';
import { PostToBlogCreateDtoApi } from '../../../blogs/dto/api/blog.to.post.create.dto';
import { Base } from '../../../../../core/domain/base';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Blog } from '../../../blogs/domain/typeorm/blog.entity';
import {
    contentConstraints,
    shortDescriptionConstraints,
    titleConstraints,
} from '../../../../../libs/contracts/constants/post/post-property.constraints';
import { isNull } from '../../../../user-accounts/utils/user/is.null';
import { CommentToUser } from '../../../comments/domain/typeorm/comment.entity';
import { PostStatus } from '../../../likes/domain/typeorm/posts/post.status.entity';

@Entity('posts')
export class Post extends Base {
    @Column({ name: 'title', type: 'varchar', length: titleConstraints.maxLength, collation: 'C' })
    title: string;

    @Column({ name: 'short_description', type: 'varchar', length: shortDescriptionConstraints.maxLength, collation: 'C' })
    shortDescription: string;

    @Column({ name: 'content', type: 'varchar', length: contentConstraints.maxLength, collation: 'C' })
    content: string;

    @ManyToOne((): typeof Blog => Blog, blog => blog.posts)
    @JoinColumn({ name: 'blog_id' })
    blog: Blog;

    @OneToMany(() => PostStatus, postStatus => postStatus.post)
    statusesPost: PostStatus[];

    @OneToMany((): typeof CommentToUser => CommentToUser, comment => comment.post)
    comments: CommentToUser[];

    static buildInstance(dto: PostToBlogCreateDtoApi, blog: Blog): Post {
        const post = new this();

        post.title = dto.title;
        post.shortDescription = dto.shortDescription;
        post.content = dto.content;
        post.blog = blog;

        return post as Post;
    }

    update(dto: PostUpdateDtoService): void {
        this.title = dto.title;
        this.shortDescription = dto.shortDescription;
        this.content = dto.content;
    }

    markDeleted(): void {
        if (!isNull(this.deletedAt)) throw new Error('Данный объект уже был помечен на удаление');
        this.deletedAt = new Date();
    }
}
