import { InjectModel } from '@nestjs/mongoose';
import { CommentDocument, CommentEntity, CommentModelType } from '../domain/comment.entity';
import { DeletionStatus } from '../../../../../libs/contracts/enums/deletion-status.enum';
import { NotFoundDomainException } from '../../../../core/exceptions/incubator-exceptions/domain-exceptions';

export class CommentRepository {
    constructor(@InjectModel(CommentEntity.name) private readonly CommentModel: CommentModelType) {}
    async save(comment: CommentDocument) {
        await comment.save();
    }
    async findCommentById(commentId: string) {
        const comment = await this.CommentModel.findOne({ _id: commentId, deletionStatus: DeletionStatus.enum['not-deleted'] });
        if (!comment) {
            throw NotFoundDomainException.create('Комментарий не найден', 'commentId');
        }
        return comment;
    }
    async updateComment(commentId: string, dto: { likesCount: number; dislikesCount: number }): Promise<boolean> {
        const updateResult = await this.CommentModel.updateOne({ _id: commentId }, dto);
        return updateResult.matchedCount === 1;
    }
}
