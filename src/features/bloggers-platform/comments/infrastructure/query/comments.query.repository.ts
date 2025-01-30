import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommentEntity, CommentModelType } from '../../domain/comment.entity';
import { NotFoundDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { DeletionStatus } from '@libs/contracts/enums/deletion-status.enum';
import { StatusEntity, StatusModelType } from '../../../likes/domain/status,entity';
import { transformCommentToGet } from '../../../../../core/utils/comments/mapping/transform.comment.map';

@Injectable()
export class CommentsQueryRepository {
    constructor(
        @InjectModel(CommentEntity.name) private readonly commentModel: CommentModelType,
        @InjectModel(StatusEntity.name) private readonly statusModel: StatusModelType,
    ) {}
    async getComment(commentId: string, userId?: string) {
        const commentPromise = this.commentModel.findOne({ _id: commentId, deletionStatus: DeletionStatus.enum['not-deleted'] });
        const statusPromise = userId ? this.statusModel.findOne({ userId, parentId: commentId }) : Promise.resolve(void 0);

        const [comment, status] = await Promise.all([commentPromise, statusPromise]);

        if (!comment) {
            throw NotFoundDomainException.create('комментарий не найден', 'commentId');
        }
        return transformCommentToGet(comment, status);
    }
}
