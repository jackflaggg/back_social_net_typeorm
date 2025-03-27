import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParentTypes } from '../../../../../libs/contracts/enums/status/parent.type.likes';
import { CommentsStatus } from '../../domain/typeorm/comments/comments.status.entity';
import { StatusLikeType } from '../../../../../libs/contracts/enums/status/status.like';

@Injectable()
export class StatusCommentRepositoryOrm {
    constructor(@InjectRepository(CommentsStatus) protected commentStatusRepository: Repository<CommentsStatus>) {}
    async getStatusComment(commentId: string, userId: string): Promise<CommentsStatus | void> {
        const result = await this.commentStatusRepository.findOne({ where: { userId, commentId } });
        if (!result) {
            return void 0;
        }
        return result;
    }
    async createLikeStatusComment(commentId: string, userId: string, status: StatusLikeType): Promise<void> {
        const result = CommentsStatus.buildInstance(status, userId, commentId);
        await this.save(result);
    }
    private async save(entity: CommentsStatus): Promise<void> {
        await this.commentStatusRepository.save(entity);
    }
    async updateLikeStatusComment(currentStatuses: CommentsStatus, status: StatusLikeType): Promise<void> {
        currentStatuses.updateStatus(status);
        await this.save(currentStatuses);
    }
}
