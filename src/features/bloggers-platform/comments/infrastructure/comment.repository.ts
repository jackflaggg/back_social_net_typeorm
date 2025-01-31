import { InjectModel } from '@nestjs/mongoose';
import { CommentDocument, CommentEntity, CommentModelType } from '../domain/comment.entity';
import { DeletionStatus } from '../../../../../libs/contracts/enums/deletion-status.enum';

export class CommentRepository {
    constructor(@InjectModel(CommentEntity.name) private readonly CommentModel: CommentModelType) {}
    async save(comment: CommentDocument) {
        await comment.save();
    }
    // TODO: Исправить этот момент!
    async findPostById(id: string) {
        const comment = await this.CommentModel.findOne({ _id: id, deletionStatus: DeletionStatus.enum['not-deleted'] });
        if (!comment) {
            return void 0;
        }
        return comment;
    }
    async findCommentById(commentId: string) {
        const comment = await this.CommentModel.findOne({ _id: commentId, deletionStatus: DeletionStatus.enum['not-deleted'] });
        if (!comment) {
            return void 0;
        }
        return comment;
    }
}
