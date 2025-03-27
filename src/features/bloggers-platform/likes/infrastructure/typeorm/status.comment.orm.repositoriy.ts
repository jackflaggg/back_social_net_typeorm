import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParentTypes } from '../../../../../libs/contracts/enums/status/parent.type.likes';
import { CommentsStatus } from '../../domain/typeorm/comments/comments.status.entity';

@Injectable()
export class StatusCommentRepositoryOrm {
    constructor(@InjectRepository(CommentsStatus) protected commentStatusRepository: Repository<CommentsStatus>) {}
    async getStatusComment(commentId: string, userId: string): Promise<string | void> {
        const query = `SELECT "status" FROM "likes" WHERE "comment_id" = $1 AND "user_id" = $2 AND "parent_type" = $3`;
        const result = await this.commentStatusRepository.query(query, [commentId, userId, ParentTypes.enum['comment']]);
        if (!result || result.length === 0) {
            return void 0;
        }
        return result[0].status;
    }
    async createLikeStatusComment(commentId: string, userId: string, status: string): Promise<void> {
        const query = `INSERT INTO "likes" (parent_type, comment_id, user_id, status) VALUES ($1, $2, $3, $4) RETURNING "id"`;
        await this.commentStatusRepository.query(query, [ParentTypes.enum['comment'], commentId, userId, status]);
    }
    async updateLikeStatusComment(commentId: string, userId: string, status: string): Promise<void> {
        const query = `UPDATE "likes" SET "status" = $1 WHERE "parent_type" = $2 AND "comment_id" = $3 AND "user_id" = $4`;
        await this.commentStatusRepository.query(query, [status, ParentTypes.enum['comment'], commentId, userId]);
    }
}
