import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundDomainException } from '../../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { GetCommentsQueryParams } from '../../../dto/repository/query/query-parans-comments';
import { StatusLike } from '../../../../../../libs/contracts/enums/status/status.like';
import { commentIntInterface, transformComment } from '../../../utils/comments/mapping/transform.comment.map';
import { getCommentQuery } from '../../../utils/comments/query.insert.get.comments';
import { CommentToUser } from '../../../domain/typeorm/comment.entity';
import { CommentsStatus } from '../../../../likes/domain/typeorm/comments/comments.status.entity';
import { User } from '../../../../../user-accounts/domain/typeorm/user/user.entity';
import { PaginationParams } from '../../../../../../core/dto/base.query-params.input-dto';
import { PaginatedCommentViewDto } from '../../../../../../core/dto/base.paginated.view-dto';

@Injectable()
export class CommentsOrmQueryRepository {
    constructor(@InjectRepository(CommentToUser) protected commentsRepo: Repository<CommentToUser>) {}
    async getAllComments(postId: string, queryData: GetCommentsQueryParams, userId?: string) {
        const { pageSize, pageNumber, sortBy, sortDirection } = getCommentQuery(queryData);

        const offset = PaginationParams.calculateSkip({ pageNumber, pageSize });

        const queryBuilder = this.commentsRepo
            .createQueryBuilder('c')
            .select([
                'c.id as id',
                'c.content AS content',
                'c.commentator_id AS "userId"',
                'c.created_at AS "createdAt"',
                'u.login AS "userLogin"',
            ])
            .where('c.deleted_at IS NULL AND c.post_id = :postId', { postId });

        if (userId) {
            queryBuilder.addSelect(subQuery => {
                return subQuery
                    .select(`COALESCE(status, '${StatusLike.enum['None']}')`)
                    .from(CommentsStatus, 'cs')
                    .where('c.id = cs.comment_id')
                    .andWhere('cs.user_id = :userId', { userId });
            }, 'myStatus');
        } else {
            queryBuilder.addSelect(`'${StatusLike.enum['None']}'`, 'myStatus');
        }

        queryBuilder
            .addSelect(qb => {
                return qb
                    .select('COUNT(status)')
                    .from(CommentsStatus, 'cs')
                    .where('cs.status = :likeStatuses', { likeStatuses: StatusLike.enum['Like'] });
            }, 'likesCount')
            .addSelect(qb => {
                return qb
                    .select('COUNT(status)')
                    .from(CommentsStatus, 'cs')
                    .where('cs.status = :dislikeStatuses', { dislikeStatuses: StatusLike.enum['Dislike'] });
            }, 'dislikesCount');

        const resultComments = await queryBuilder
            .leftJoin(User, 'u', 'u.id = c.commentator_id')
            .orderBy(`c.${sortBy}`, `${sortDirection}`)
            .groupBy('c.id, u.login')
            .limit(pageSize)
            .offset(offset)
            .getRawMany();

        const totalCount = await queryBuilder.getCount();

        const commentsView = resultComments.map(elem => transformComment(elem));

        return PaginatedCommentViewDto.mapToView<commentIntInterface[]>({
            items: commentsView,
            page: pageNumber,
            size: pageSize,
            totalCount,
        });
    }
    async getComment(commentId: string, userId?: string): Promise<commentIntInterface> {
        const queryBuilder = this.commentsRepo
            .createQueryBuilder('c')
            .select([
                'c.id as id',
                'c.content AS content',
                'c.commentator_id AS "userId"',
                'c.created_at AS "createdAt"',
                'u.login AS "userLogin"',
            ])
            .where('c.deleted_at IS NULL AND c.id = :commentId', { commentId });

        if (userId) {
            queryBuilder.addSelect(subQuery => {
                return subQuery
                    .select(`COALESCE(status, '${StatusLike.enum['None']}')`)
                    .from(CommentsStatus, 'cs')
                    .where('c.id = cs.comment_id')
                    .andWhere('cs.user_id = :userId', { userId });
            }, 'myStatus');
        } else {
            queryBuilder.addSelect(`'${StatusLike.enum['None']}'`, 'myStatus');
        }

        queryBuilder
            .addSelect(qb => {
                return qb
                    .select('COUNT(status)')
                    .from(CommentsStatus, 'cs')
                    .where('cs.status = :likeStatuses', { likeStatuses: StatusLike.enum['Like'] });
            }, 'likesCount')
            .addSelect(qb => {
                return qb
                    .select('COUNT(status)')
                    .from(CommentsStatus, 'cs')
                    .where('cs.status = :dislikeStatuses', { dislikeStatuses: StatusLike.enum['Dislike'] });
            }, 'dislikesCount');

        const resultComment = await queryBuilder.leftJoin(User, 'u', 'u.id = c.commentator_id').getRawOne();

        if (!resultComment) {
            throw NotFoundDomainException.create('Непредвиденная ошибка, коммент не найден', 'commentId');
        }

        return transformComment(resultComment);
    }
}
