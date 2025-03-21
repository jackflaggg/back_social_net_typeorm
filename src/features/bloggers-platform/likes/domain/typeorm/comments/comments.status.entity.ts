import { StatusLike } from '../../../../../../libs/contracts/enums/status/status.like';
import { likeViewModel } from '../../../types/like.view';
import { Column, Entity } from 'typeorm';
import { BaseEntityWithoutDeletedAtAndCreatedAt } from '../../../../../../core/domain/base.entity';

@Entity('statuses_comments')
export class CommentsStatus extends BaseEntityWithoutDeletedAtAndCreatedAt {
    @Column({ type: String })
    userId: string;

    @Column({ type: String })
    commentId: string;

    @Column({ type: 'varchar', enum: StatusLike.enum, default: StatusLike.enum['None'] }) // Использование enum
    status: string;

    public static buildInstance(dto: likeViewModel): CommentsStatus {
        const status = new this();
        status.userId = dto.userId;
        status.commentId = dto.parentId;
        status.status = dto.status;
        return status as CommentsStatus;
    }
}
