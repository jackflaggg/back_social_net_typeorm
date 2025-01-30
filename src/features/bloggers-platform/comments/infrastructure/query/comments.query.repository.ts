import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommentEntity, CommentModelType } from '../../domain/comment.entity';
import { NotFoundDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { DeletionStatus } from '@libs/contracts/enums/deletion-status.enum';
import { StatusEntity, StatusModelType } from '../../../likes/domain/status,entity';
import { transformCommentToGet } from '../../../../../core/utils/comments/mapping/transform.comment.map';
import { GetCommentsQueryParams } from '../../dto/repository/query/query-parans-comments';
import { getCommentQuery } from '../../../../../core/utils/comments/query.insert.get.comments';

@Injectable()
export class CommentsQueryRepository {
    constructor(
        @InjectModel(CommentEntity.name) private readonly commentModel: CommentModelType,
        @InjectModel(StatusEntity.name) private readonly statusModel: StatusModelType,
    ) {}
    async getComment(commentId: string, userId?: string) {
        const commentPromise = this.commentModel.findOne({ _id: commentId, deletionStatus: DeletionStatus.enum['not-deleted'] });
        const statusPromise = userId ? this.statusModel.findOne({ userId, parentId: commentId }) : Promise.resolve(void 0);

        const [comment, status] = await Promise.all([commentPromise, statusPromise]);

        if (!comment) {
            throw NotFoundDomainException.create('комментарий не найден', 'commentId');
        }
        return transformCommentToGet(comment, status);
    }
    async getAllComments(postId: string, queryData: GetCommentsQueryParams, userId?: string | null) {
        console.log(queryData);
        const { pageNumber, pageSize, sortBy, sortDirection } = getCommentQuery(queryData);

        console.log(pageNumber, pageSize, sortBy, sortDirection);
        const skipAmount = (pageNumber - 1) * pageSize;

        const comments = await this.commentModel
            .find({ postId: postId })
            .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
            .skip(skipAmount)
            .limit(pageNumber)
            .lean();

        const totalCountComments = await this.commentModel.countDocuments({ postId }); // Можно оптимизировать, но пока оставим для ясности

        // Оптимизация: получаем общее количество в том же запросе, что и сами комментарии
        // const result = await CommentModelClass.find({ postId: paramsToPostId }).count();
        // const totalCountComments = result.length;
        // const comments = result.slice(skipAmount, skipAmount + pageSizeNum);

        const pagesCount = Math.ceil(totalCountComments / pageNumber);

        const userPromises = comments.map(async comment => {
            const status = userId ? await this.statusModel.findOne({ userId: userId, parentId: comment._id }) : null;
            return transformCommentToGet(comment, status);
        });

        const mapCommented = await Promise.all(userPromises);

        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCountComments,
            items: mapCommented,
        };
    }
    private getFilter(userId?: string) {
        const filter: any = { deletionStatus: DeletionStatus.enum['not-deleted'] };
        if (userId) {
            filter.userId = userId;
        }
        return filter;
    }
}
