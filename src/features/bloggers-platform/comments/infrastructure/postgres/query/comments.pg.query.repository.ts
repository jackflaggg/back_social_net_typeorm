import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { NotFoundDomainException } from '../../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { transformComment } from '../../../../../../core/utils/comments/mapping/transform.comment.map';

@Injectable()
export class CommentsPgQueryRepository {
    constructor(@InjectDataSource() protected dataSource: DataSource) {}
    async getComment(commentId: string, userId?: string | null) {
        const query = `
            SELECT c."id", c."content", c."commentator_id" AS "userId", c."created_at" AS "createdAt", u."login" AS "userLogin" FROM "comments"  AS c
            JOIN "users" u ON u.id = c.commentator_id
            WHERE c."id" = $1 
              --AND c."commentator_id" = $2
              AND c."deleted_at" IS NULL`;

        const result = await this.dataSource.query(query, [commentId /*, userId*/]);

        if (!result || result.length === 0) {
            throw NotFoundDomainException.create('Непредвиденная ошибка, коммент не найден', 'commentId');
        }

        return transformComment(result[0]);
    }
    async getAllComments(postId: string, query: any, userId: string | null) {}
}
