import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommentEntity, CommentModelType } from '../../domain/comment.entity';

@Injectable()
export class CommentsQueryRepository {
    constructor(@InjectModel(CommentEntity.name) private readonly commentModel: CommentModelType) {}
    async getComment(id: string) {
        const comment = await this.commentModel.findOne({ _id: id });
        if (!comment) {
            return void 0;
        }
        return comment;
    }
}
