import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeletionStatus } from '@libs/contracts/enums/deletion-status.enum';
import { PaginatedBlogViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { PostEntity, PostModelType } from '../../domain/post.entity';
import { GetPostsQueryParams } from '../../dto/api/get-posts-query-params.input.dto';
import { PostViewDto } from '../../dto/repository/post-view';
import { PaginationParams } from '../../../../../core/dto/base.query-params.input-dto';
import { getPostsQuery } from '../../../../../core/utils/post/query.insert.get';
import { NotFoundDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { StatusEntity, StatusModelType } from '../../../likes/domain/status,entity';
import { StatusLike } from '@libs/contracts/enums/status.like';
import { statusesUsersMapper, transformStatus } from '../../../../../core/utils/like/features/mapper.status';
import { transformPostStatusUsers } from '../../../../../core/utils/post/post.mapper';

@Injectable()
export class PostsQueryRepository {
    constructor(
        @InjectModel(PostEntity.name) private readonly postModel: PostModelType,
        @InjectModel(StatusEntity.name) private readonly statusModel: StatusModelType,
    ) {}
    async getAllPosts(queryData: GetPostsQueryParams, userId?: string) {
        const { pageSize, pageNumber, sortBy, sortDirection } = getPostsQuery(queryData);

        const skip = PaginationParams.calculateSkip(queryData) ?? (pageNumber - 1) * pageSize;

        const posts = await this.postModel
            .find({})
            .skip(skip)
            .limit(+pageSize)
            .sort({ [sortBy]: sortDirection })
            .lean()
            .exec();

        const postIds = posts.map(post => post._id.toString());

        // Получаем все статусы для постов одним запросом
        const allStatuses = await this.statusModel
            .find({ parentId: { $in: postIds } })
            .lean()
            .exec();

        console.log(allStatuses);

        const postsView = posts.map(post => {
            const postView = PostViewDto.mapToView(post);
            const postStatuses = allStatuses.filter(status => status.parentId === post._id.toString());

            const likesCount = postStatuses.filter(status => status.status === 'Like').length;
            const dislikesCount = postStatuses.filter(status => status.status === 'Dislike').length;
            const myStatus = userId ? postStatuses.find(status => status.userId === userId)?.status || 'None' : 'None';
        });

        const totalCount = await this.postModel.countDocuments({}).exec();

        return PaginatedBlogViewDto.mapToView({
            items: posts,
            page: pageNumber,
            size: pageSize,
            totalCount,
        });
    }
    async getPost(postId: string, userId?: string | null) {
        const postPromise = this.postModel.findOne({ _id: postId, deletionStatus: DeletionStatus.enum['not-deleted'] });

        const likeStatusPromise = userId ? this.statusModel.findOne({ userId, parentId: postId }) : Promise.resolve(null);

        const latestThreeLikesPromise = this.statusModel
            .find({ parentId: postId, status: StatusLike.enum['Like'] })
            .sort({ createdAt: -1 })
            .limit(3)
            .exec();

        try {
            const [post, likeStatus, latestThreeLikes] = await Promise.all([postPromise, likeStatusPromise, latestThreeLikesPromise]);

            if (!post) {
                throw NotFoundDomainException.create('Post not found', 'post');
            }

            const transformedLikeStatus = likeStatus ? transformStatus(likeStatus) : null;
            const transformedUsers = latestThreeLikes.map(user => statusesUsersMapper(user));

            return transformPostStatusUsers(post, transformedLikeStatus, transformedUsers);
        } catch (error) {
            // Обработка ошибок, например, проблемы с базой данных
            console.error('Error fetching post data:', error);
            //  ... и выброс соответствующего исключения
            throw new Error('Failed to fetch post data'); // Или более специфичное исключение
        }
    }
}
