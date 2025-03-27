import { StatusLike, StatusLikeType } from '../../../../../../libs/contracts/enums/status/status.like';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../../../../user-accounts/domain/typeorm/user/user.entity';
import { CommentToUser } from '../../../../comments/domain/typeorm/comment.entity';

@Entity('statuses_comments')
export class CommentsStatus {
    @ManyToOne((): typeof User => User, user => user.likesComments)
    @JoinColumn({ name: 'user_id' })
    user: User;
    @PrimaryColumn({ name: 'user_id', nullable: false })
    userId: string;

    @ManyToOne((): typeof CommentToUser => CommentToUser, comment => comment.likesComments)
    @JoinColumn({ name: 'comment_id' })
    comment: CommentToUser;
    @PrimaryColumn({ name: 'comment_id', nullable: false })
    commentId: string;

    @Column({ type: 'enum', enum: StatusLike.enum, default: StatusLike.enum['None'] })
    status: StatusLikeType;

    @CreateDateColumn({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    public static buildInstance(statusComment: StatusLikeType, userId: string, commentId: string): CommentsStatus {
        const status = new this();

        status.userId = userId;
        status.commentId = commentId;
        status.status = statusComment || StatusLike.enum['None'];
        return status as CommentsStatus;
    }

    public updateStatus(status: StatusLikeType) {
        this.status = status;
    }
}
