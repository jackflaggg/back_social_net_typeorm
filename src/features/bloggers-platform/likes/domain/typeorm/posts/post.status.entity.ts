import { StatusLike, StatusLikeType } from '../../../../../../libs/contracts/enums/status/status.like';
import { likeViewModel } from '../../../types/like.view';
import { BaseEntityWithoutDeletedAtAndCreatedAt } from '../../../../../../core/domain/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { User } from '../../../../../user-accounts/domain/typeorm/user/user.entity';
import { Post } from '../../../../posts/domain/typeorm/post.entity';

@Entity('statuses_posts')
export class PostStatus extends BaseEntityWithoutDeletedAtAndCreatedAt {
    @Column({ type: 'enum', enum: StatusLike.enum, default: StatusLike.enum['None'] }) // Использование enum
    status: StatusLikeType;

    @ManyToOne((): typeof User => User, user => user.likesPosts)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToOne((): typeof Post => Post, post => post.id)
    @JoinColumn({ name: 'post_id' })
    post: Post;

    // @Column()
    // postId: string;

    public static buildInstance(dto: likeViewModel, user: User, post: Post): PostStatus {
        const status = new this();

        status.post = post;
        status.user = user;
        status.status = dto.status || StatusLike.enum['None'];
        return status as PostStatus;
    }
    public updateStatus(status: StatusLikeType) {
        this.status = status;
    }
}
