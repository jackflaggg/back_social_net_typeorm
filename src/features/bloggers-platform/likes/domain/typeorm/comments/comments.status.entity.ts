import { StatusLike, StatusLikeType } from '../../../../../../libs/contracts/enums/status/status.like';
import { likeViewModel } from '../../../types/like.view';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntityWithoutDeletedAtAndCreatedAt } from '../../../../../../core/domain/base.entity';
import { User } from '../../../../../user-accounts/domain/typeorm/user/user.entity';
import { CommentToUser } from '../../../../comments/domain/typeorm/comment.entity';

@Entity('statuses_comments')
export class CommentsStatus extends BaseEntityWithoutDeletedAtAndCreatedAt {
    @OneToOne((): typeof User => User, user => user.likesComments)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToOne((): typeof CommentToUser => CommentToUser, comment => comment)
    @JoinColumn({ name: 'comment_id' })
    comment: CommentToUser;

    @Column({ type: 'enum', enum: StatusLike.enum, default: StatusLike.enum['None'] })
    status: StatusLikeType;

    public static buildInstance(dto: likeViewModel, user: User, comment: CommentToUser): CommentsStatus {
        const status = new this();

        status.user = user;
        status.comment = comment;
        status.status = dto.status || StatusLike.enum['None'];
        return status as CommentsStatus;
    }

    public updateStatus(status: StatusLikeType) {
        this.status = status;
    }
}
