import { InjectModel } from '@nestjs/mongoose';
import { CommentDocument, CommentEntity, CommentModelType } from '../domain/comment.entity';
import { DeletionStatus } from '../../../../../libs/contracts/enums/deletion-status.enum';

export class CommentRepository {
    constructor(@InjectModel(CommentEntity.name) private readonly CommentModel: CommentModelType) {}
    async createComment(payload: any, postId: string, user: any) {
        const comment = await this.CommentModel.create();
    }
    async save(comment: CommentDocument) {
        await comment.save();
    }
    async findPostById(id: string) {
        const comment = await this.CommentModel.findOne({ _id: id, deletionStatus: DeletionStatus.enum['not-deleted'] });
        if (!comment) {
            return void 0;
        }
        return comment;
    }
}
