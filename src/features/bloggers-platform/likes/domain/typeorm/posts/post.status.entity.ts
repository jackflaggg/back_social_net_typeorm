import { StatusLike, StatusLikeType } from '../../../../../../libs/contracts/enums/status/status.like';
import { BaseEntityWithoutDeletedAtAndCreatedAt } from '../../../../../../core/domain/base';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../../../../user-accounts/domain/typeorm/user/user.entity';
import { Post } from '../../../../posts/domain/typeorm/post.entity';

@Entity('statuses_posts')
export class PostStatus extends BaseEntityWithoutDeletedAtAndCreatedAt {
    @Column({ type: 'enum', enum: StatusLike.enum, default: StatusLike.enum['None'] })
    status: StatusLikeType;

    @ManyToOne((): typeof User => User, user => user.likesPosts)
    user: User;
    @Column()
    userId: string;

    @ManyToOne((): typeof Post => Post, post => post.statusesPost)
    post: Post;
    @Column()
    postId: string;

    public static buildInstance(statusPost: StatusLikeType, user: User, post: Post): PostStatus {
        const status = new this();

        status.post = post;
        status.user = user;
        status.status = statusPost || StatusLike.enum['None'];
        return status as PostStatus;
    }

    public updateStatus(status: StatusLikeType): void {
        this.status = status;
    }
}
