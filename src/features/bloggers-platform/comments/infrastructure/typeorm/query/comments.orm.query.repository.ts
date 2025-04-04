import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
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
import { Post } from '../../../../posts/domain/typeorm/post.entity';
import { PostStatus } from '../../../../likes/domain/typeorm/posts/post.status.entity';

@Injectable()
export class CommentsOrmQueryRepository {
    constructor(@InjectRepository(CommentToUser) protected commentsRepo: Repository<CommentToUser>) {}

    async getAllComments(postId: string, queryData: GetCommentsQueryParams, userId?: string) {
        const { pageSize, pageNumber, sortBy, sortDirection } = getCommentQuery(queryData);

        const offset = PaginationParams.calculateSkip({ pageNumber, pageSize });

        const queryBuilder = this.commentsRepo
            .createQueryBuilder('c')
            .select(['c.id as id', 'c.content AS content', 'c.commentator_id AS "userId"', 'c.created_at AS "createdAt"'])
            .where('c.deleted_at IS NULL AND c.post_id = :postId', { postId })
            .limit(pageSize)
            .offset(offset);

        const resultComments = await queryBuilder
            .addSelect(this.getUserLogin, 'userLogin')
            .addSelect(this.getLikesCount, 'likesCount')
            .addSelect(this.getDislikesCount, 'dislikesCount')
            .addSelect(this.getMyStatus(userId), 'myStatus')
            .orderBy(`c.${sortBy}`, sortDirection)
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
            .select(['c.id as id', 'c.content AS content', 'c.commentator_id AS "userId"', 'c.created_at AS "createdAt"'])
            .where('c.deleted_at IS NULL AND c.id = :commentId', { commentId });

        const comment = await queryBuilder
            .addSelect(this.getMyStatus(userId), 'myStatus')
            .addSelect(this.getUserLogin, 'userLogin')
            .addSelect(this.getLikesCount, 'likesCount')
            .addSelect(this.getDislikesCount, 'dislikesCount')
            .getRawOne();

        if (!comment) {
            throw NotFoundDomainException.create('Непредвиденная ошибка, коммент не найден', 'commentId');
        }

        return transformComment(comment);
    }

    private getMyStatus = (userId?: string) => (queryBuilder: SelectQueryBuilder<CommentToUser>) => {
        if (!userId) {
            return queryBuilder.select(`'${StatusLike.enum['None']}' AS "statusUser"`).from(CommentsStatus, 'cs').limit(1);
        }
        console.log(userId);
        return queryBuilder
            .select(`cs.status AS "statusUser"`)
            .from(CommentsStatus, 'cs')
            .where(`cs.user_id = :userId AND cs.comment_id = c.id`, { userId })
            .limit(1);
    };

    private getUserLogin(queryBuilder: SelectQueryBuilder<CommentToUser>) {
        return queryBuilder.select(`u.login as "userLogin"`).from(User, 'u').where('c.commentator_id = u.id');
    }

    private getLikesCount(queryBuilder: SelectQueryBuilder<CommentToUser>) {
        return queryBuilder
            .select(`COUNT(status)::INT as "statusLike"`)
            .from(CommentsStatus, `cs`)
            .where(`c.id = cs.comment_id AND cs.status = :likeStatus`, { likeStatus: StatusLike.enum['Like'] });
    }

    private getDislikesCount(queryBuilder: SelectQueryBuilder<CommentToUser>) {
        return queryBuilder
            .select(`COUNT(status)::INT as "statusDislike"`)
            .from(CommentsStatus, `cs`)
            .where(`c.id = cs.comment_id AND cs.status = :dislikeStatus`, { dislikeStatus: StatusLike.enum['Dislike'] });
    }
}
