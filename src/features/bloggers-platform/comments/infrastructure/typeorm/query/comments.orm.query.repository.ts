import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { NotFoundDomainException } from '../../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { GetCommentsQueryParams } from '../../../dto/repository/query/query-parans-comments';
import { ParentTypes } from '../../../../../../libs/contracts/enums/status/parent.type.likes';
import { StatusLike } from '../../../../../../libs/contracts/enums/status/status.like';
import { commentIntInterface, commentOutInterface, transformComment } from '../../../utils/comments/mapping/transform.comment.map';
import { getCommentQuery } from '../../../utils/comments/query.insert.get.comments';
import { CommentToUser } from '../../../domain/typeorm/comment.entity';
import { CommentsStatus } from '../../../../likes/domain/typeorm/comments/comments.status.entity';
import { User } from '../../../../../user-accounts/domain/typeorm/user/user.entity';

@Injectable()
export class CommentsOrmQueryRepository {
    constructor(@InjectRepository(CommentToUser) protected commentsRepo: Repository<CommentToUser>) {}
    async getAllComments(postId: string, queryData: GetCommentsQueryParams, userId?: string | null) {
        // const { pageSize, pageNumber, sortBy, sortDirection } = getCommentQuery(queryData);
        //
        // const offset = (pageNumber - 1) * pageSize;
        //
        // const orderBy = `${sortBy} ${sortDirection.toUpperCase()}`;
        //
        // const query = `
        //     SELECT c."id",
        //            c."content",
        //            c."commentator_id" AS "userId",
        //            c."created_at" AS "createdAt",
        //            u."login" AS "userLogin",
        //            COALESCE((SELECT status FROM likes WHERE parent_type = $1 AND comment_id = c."id" AND user_id = $2), $3) AS "myStatus",
        //            SUM(CASE
        //                    WHEN l.status = $4 AND l.parent_type = $5 AND c.id = l.comment_id THEN 1 ELSE 0 END) AS "likesCount",
        //            SUM(CASE
        //                    WHEN l.status = $6 AND l.parent_type = $7 AND c.id = l.comment_id THEN 1 ELSE 0 END) AS "dislikesCount"
        //     FROM "comments" c
        //              LEFT JOIN "users" u ON u."id" = c."commentator_id"
        //              LEFT JOIN "likes" l ON l."comment_id" = c."id" --AND l."user_id" = $8
        //     WHERE c."post_id" = $8
        //       AND c."deleted_at" IS NULL
        //     GROUP BY c."id", u."login"
        //     ORDER BY ${orderBy}
        //     LIMIT $9
        //     OFFSET $10`;
        //
        // const resultComments = await this.dataSource.query(query, [
        //     ParentTypes.enum['comment'],
        //     userId,
        //     StatusLike.enum['None'],
        //     StatusLike.enum['Like'],
        //     ParentTypes.enum['comment'],
        //     StatusLike.enum['Dislike'],
        //     ParentTypes.enum['comment'],
        //     postId,
        //     pageSize,
        //     offset,
        // ]);
        //
        // const commentsView = resultComments.map((comment: commentOutInterface) => transformComment(comment));
        //
        // const queryCount = `
        //     SELECT COUNT(*) AS "totalCount"
        //     FROM "comments"
        //     WHERE "post_id" = $1 AND "deleted_at" IS NULL`;
        //
        // const totalCountComments = await this.dataSource.query(queryCount, [postId]);
        //
        // const pagesCount = Math.ceil(Number(totalCountComments[0].totalCount) / pageSize);
        //
        // return {
        //     pagesCount: Number(pagesCount),
        //     page: Number(pageNumber),
        //     pageSize: Number(pageSize),
        //     totalCount: Number(totalCountComments[0].totalCount),
        //     items: commentsView,
        // };
    }
    async getComment(commentId: string, userId?: string): Promise<commentIntInterface> {
        const queryBuilder = this.commentsRepo.createQueryBuilder('c').where('c.deleted_at IS NULL AND c.id = :commentId', { commentId });

        if (userId) {
            queryBuilder.andWhere(
                new Brackets(qb => {
                    qb.where('cs.user_id = :userId', { userId });
                }),
            );
        }
        const resultComment = await queryBuilder
            .select(['c.id as id, c.content AS content, c.commentator_id AS "userId", c.created_at AS "createdAt", u.login AS "userLogin"'])
            .addSelect((subQuery: SelectQueryBuilder<CommentsStatus>): SelectQueryBuilder<CommentsStatus> => {
                return subQuery
                    .select(`COALESCE(status, '${StatusLike.enum['None']}')`)
                    .from(CommentsStatus, 'cs')
                    .where('c.id = cs.comment_id');
            }, 'myStatus')
            .leftJoin(CommentsStatus, 'cs', 'cs.user_id = c.commentator_id')
            .leftJoin(User, 'u', 'u.id = c.commentator_id')
            .getRawOne();

        if (!resultComment) {
            throw NotFoundDomainException.create('Непредвиденная ошибка, коммент не найден', 'commentId');
        }

        return transformComment(resultComment);
    }
}
