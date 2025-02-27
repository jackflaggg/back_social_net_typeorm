import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { NotFoundDomainException } from '../../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { transformComment } from '../../../../../../core/utils/comments/mapping/transform.comment.map';
import { getCommentQuery } from '../../../../../../core/utils/comments/query.insert.get.comments';
import { GetCommentsQueryParams } from '../../../dto/repository/query/query-parans-comments';
import { ParentTypes } from '../../../../../../libs/contracts/enums/parent.type.likes';
import { StatusLike } from '../../../../../../libs/contracts/enums/status.like';

@Injectable()
export class CommentsPgQueryRepository {
    constructor(@InjectDataSource() protected dataSource: DataSource) {}
    async getComment(commentId: string, userId: string | null) {
        const query = `
            SELECT c."id",
                   c."content",
                   c."commentator_id" AS "userId",
                   c."created_at" AS "createdAt",
                   u."login" AS "userLogin",
                   COALESCE((SELECT status FROM likes WHERE parent_type = $1 AND comment_id=c."id" AND user_id = $2), $3) AS "myStatus",
                   SUM(CASE WHEN l.status = $4 AND l.parent_type = $5 AND c.id = l.comment_id THEN 1 ELSE 0 END) AS "likesCount",
                   SUM(CASE WHEN l.status = $6 AND l.parent_type = $7 AND c.id = l.comment_id THEN 1 ELSE 0 END) AS "dislikesCount"
            FROM "comments" c
            LEFT JOIN "users" u ON u."id" = c."commentator_id"
            LEFT JOIN "likes" l ON l."comment_id" = c."id" --AND l."user_id" = $8
            WHERE c."id" = $8
            AND c."deleted_at" IS NULL
            GROUP BY c."id", u."login"`;

        const result = await this.dataSource.query(query, [
            ParentTypes.enum['comment'],
            userId,
            StatusLike.enum['None'],
            StatusLike.enum['Like'],
            ParentTypes.enum['comment'],
            StatusLike.enum['Dislike'],
            ParentTypes.enum['comment'],
            //userId,
            commentId,
        ]);
        console.log(result);

        if (!result || result.length === 0) {
            throw NotFoundDomainException.create('Непредвиденная ошибка, коммент не найден', 'commentId');
        }

        return transformComment(result[0]);
    }
    async getAllComments(postId: string, queryData: GetCommentsQueryParams, userId?: string | null) {
        const { pageSize, pageNumber, sortBy, sortDirection } = getCommentQuery(queryData);

        const offset = (pageNumber - 1) * pageSize;

        const orderBy = `${sortBy} ${sortDirection.toUpperCase()}`;

        const query = `
            SELECT c."id",
                   c."content",
                   c."commentator_id" AS "userId",
                   c."created_at" AS "createdAt",
                   u."login" AS "userLogin",
                   COALESCE((SELECT status FROM likes WHERE parent_type = $1 AND comment_id = c."id" AND user_id = $2), $3) AS "myStatus",
                   SUM(CASE
                           WHEN l.status = $4 AND l.parent_type = $5 AND c.id = l.comment_id THEN 1 ELSE 0 END) AS "likesCount",
                   SUM(CASE
                           WHEN l.status = $6 AND l.parent_type = $7 AND c.id = l.comment_id THEN 1 ELSE 0 END) AS "dislikesCount"
            FROM "comments" c
                     LEFT JOIN "users" u ON u."id" = c."commentator_id"
                     LEFT JOIN "likes" l ON l."comment_id" = c."id" --AND l."user_id" = $8
            WHERE c."post_id" = $8
              AND c."deleted_at" IS NULL
            GROUP BY c."id", u."login"
            ORDER BY ${orderBy}
            LIMIT $9
            OFFSET $10`;

        const resultComments = await this.dataSource.query(query, [
            ParentTypes.enum['comment'],
            userId,
            StatusLike.enum['None'],
            StatusLike.enum['Like'],
            ParentTypes.enum['comment'],
            StatusLike.enum['Dislike'],
            ParentTypes.enum['comment'],
            //userId,
            postId,
            pageSize,
            offset,
        ]);

        const commentsView = resultComments.map(comment => transformComment(comment));

        const queryCount = `
            SELECT COUNT(*) AS "totalCount" 
            FROM "comments" 
            WHERE "post_id" = $1 AND "deleted_at" IS NULL`;

        const totalCountComments = await this.dataSource.query(queryCount, [postId]);

        const pagesCount = Math.ceil(+totalCountComments[0].totalCount / pageSize);

        return {
            pagesCount: +pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: +totalCountComments[0].totalCount,
            items: commentsView,
        };
    }
}
