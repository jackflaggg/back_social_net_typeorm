import { StatusLike } from '../../../../../../libs/contracts/enums/status/status.like';
import { likeViewModel } from '../../../types/like.view';
import { BaseEntityWithoutDeletedAtAndCreatedAt } from '../../../../../../core/domain/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('statuses_posts')
export class PostStatus extends BaseEntityWithoutDeletedAtAndCreatedAt {
    @Column({ type: String })
    userId: string;

    @Column({ type: String })
    postId: string;

    @Column({ type: 'varchar', enum: StatusLike.enum, default: StatusLike.enum['None'] }) // Использование enum
    status: string;

    public static buildInstance(dto: likeViewModel): PostStatus {
        const status = new this();
        status.userId = dto.userId;
        status.postId = dto.parentId;
        status.status = dto.status; // Установка значения по умолчанию, если не указано
        return status as PostStatus;
    }
}
