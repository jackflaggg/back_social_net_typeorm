import { StatusLike, StatusLikeType } from '../../../../../../libs/contracts/enums/status/status.like';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../../../../user-accounts/domain/typeorm/user/user.entity';
import { Post } from '../../../../posts/domain/typeorm/post.entity';

@Entity('statuses_posts')
export class PostStatus {
    @ManyToOne((): typeof User => User, user => user.likesPosts)
    @JoinColumn({ name: 'user_id' })
    user: User;
    @PrimaryColumn({ name: 'user_id', nullable: false })
    userId: string;

    @ManyToOne((): typeof Post => Post, post => post.statusesPost)
    @JoinColumn({ name: 'post_id' })
    post: Post;
    @PrimaryColumn({ name: 'post_id', nullable: false })
    postId: string;

    @Column({ type: 'enum', enum: StatusLike.enum, default: StatusLike.enum['None'] })
    status: StatusLikeType;

    @CreateDateColumn({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    public static buildInstance(statusPost: StatusLikeType, userId: string, postId: string): PostStatus {
        const status = new this();

        status.postId = postId;
        status.userId = userId;
        status.status = statusPost || StatusLike.enum['None'];
        return status as PostStatus;
    }

    updateStatus(status: StatusLikeType): void {
        this.status = status;
    }
}
