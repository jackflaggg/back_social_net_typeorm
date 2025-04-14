import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { CommentToUser } from '../../domain/typeorm/comment.entity';

@Injectable()
export class CommentsRepositoryOrm {
    constructor(@InjectRepository(CommentToUser) protected commentRepository: Repository<CommentToUser>) {}
    async findCommentById(commentId: string) {
        const result = await this.commentRepository.findOne({ where: { id: +commentId } });
        if (!result) {
            throw NotFoundDomainException.create('коммент не найден', 'commentId');
        }
        return result;
    }
    async createComment(content: string, postId: string, userId: string): Promise<string> {
        const newComment = CommentToUser.buildInstance(content, userId, postId);
        return await this.save(newComment);
    }

    private async save(entity: CommentToUser): Promise<string> {
        const result = await this.commentRepository.save(entity);
        return String(result.id);
    }

    async updateComment(comment: CommentToUser, content: string): Promise<void> {
        comment.updateContent(content);
        await this.save(comment);
    }

    async deleteComment(comment: CommentToUser): Promise<void> {
        comment.makeDeleted();
        await this.save(comment);
    }
}
