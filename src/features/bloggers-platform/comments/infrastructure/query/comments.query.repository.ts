import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommentEntity, CommentModelType } from '../../domain/comment.entity';
import { NotFoundDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { DeletionStatus } from '@libs/contracts/enums/deletion-status.enum';
import { StatusEntity, StatusModelType } from '../../../likes/domain/status,entity';

@Injectable()
export class CommentsQueryRepository {
    constructor(
        @InjectModel(CommentEntity.name) private readonly commentModel: CommentModelType,
        @InjectModel(StatusEntity.name) private readonly statusModel: StatusModelType,
    ) {}
    async getComment(commentId: string, userId?: string) {
        const comment = await this.commentModel.findOne({ _id: commentId, deletionStatus: DeletionStatus.enum['not-deleted'] });
        if (!comment) {
            throw NotFoundDomainException.create(`Comment with id ${commentId} not found.`, 'CommentsQueryRepository');
        }
        return comment;
    }
}
