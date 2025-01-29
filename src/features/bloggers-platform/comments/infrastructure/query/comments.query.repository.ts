import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommentEntity, CommentModelType } from '../../domain/comment.entity';
import { NotFoundDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';

@Injectable()
export class CommentsQueryRepository {
    constructor(@InjectModel(CommentEntity.name) private readonly commentModel: CommentModelType) {}
    async getComment(id: string, userId?: string) {
        const comment = await this.commentModel.findOne({ _id: id });
        if (!comment) {
            throw NotFoundDomainException.create(`Comment with id ${id} not found.`, 'CommentsQueryRepository');
        }
        return comment;
    }
}
