import { StatusLike, StatusLikeType } from '../../../../../../libs/contracts/enums/status/status.like';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntityWithoutDeletedAtAndCreatedAt } from '../../../../../../core/domain/base';
import { User } from '../../../../../user-accounts/domain/typeorm/user/user.entity';
import { CommentToUser } from '../../../../comments/domain/typeorm/comment.entity';

@Entity('statuses_comments')
export class CommentsStatus extends BaseEntityWithoutDeletedAtAndCreatedAt {
    @ManyToOne((): typeof User => User, user => user.likesComments)
    user: User;

    @ManyToOne((): typeof CommentToUser => CommentToUser, comment => comment.likesComments)
    comment: CommentToUser;

    @Column({ type: 'enum', enum: StatusLike.enum, default: StatusLike.enum['None'] })
    status: StatusLikeType;

    @Column()
    userId: string;

    @Column()
    commentId: string;

    public static buildInstance(statusComment: StatusLikeType, user: User, comment: CommentToUser): CommentsStatus {
        const status = new this();

        status.user = user;
        status.comment = comment;
        status.status = statusComment || StatusLike.enum['None'];
        return status as CommentsStatus;
    }

    public updateStatus(status: StatusLikeType) {
        this.status = status;
    }
}
