import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeletionStatus } from 'libs/contracts/enums/deletion-status.enum';
import { PostEntity, PostModelType } from '../../domain/post.entity';
import { GetPostsQueryParams } from '../../dto/api/get-posts-query-params.input.dto';
import { PaginationParams } from '../../../../../core/dto/base.query-params.input-dto';
import { getPostsQuery } from '../../../../../core/utils/post/query.insert.get';
import { NotFoundDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { StatusEntity, StatusModelType } from '../../../likes/domain/status.entity';
import { StatusLike } from 'libs/contracts/enums/status.like';
import { statusesUsersMapper, transformStatus } from '../../../../../core/utils/like/features/mapper.status';
import { transformPostStatusUsers } from '../../../../../core/utils/post/post.mapper';

@Injectable()
export class PostsQueryRepository {
    constructor(
        @InjectModel(PostEntity.name) private readonly postModel: PostModelType,
        @InjectModel(StatusEntity.name) private readonly statusModel: StatusModelType,
    ) {}
    async getAllPosts(queryData: GetPostsQueryParams, userId?: string | null, blogId?: string) {
        const { pageSize, pageNumber, sortBy, sortDirection } = getPostsQuery(queryData);

        const skip = PaginationParams.calculateSkip(queryData) ?? (pageNumber - 1) * pageSize;
        const filter = blogId ? { blogId } : {};

        const [posts, totalCount] = await Promise.all([
            this.postModel
                .find(filter)
                .select('title shortDescription content blogId blogName createdAt extendedLikesInfo') // Забираем только нужные поля
                .skip(skip)
                .limit(Number(pageSize))
                .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
                .lean()
                .exec(),
            this.postModel.countDocuments(filter).exec(),
        ]);

        const pageCount = Math.ceil(totalCount / pageSize);

        const postIds = posts.map(post => post._id.toString());

        // Получаем все лайки для постов и обрабатываем их
        const allLikes = await this.statusModel
            .find({ parentId: { $in: postIds }, status: StatusLike.enum['Like'] })
            .sort({ createdAt: -1 })
            .lean()
            .exec();

        // накапливаю объект с ключом айди и значением массивом юзеров
        //     key: [
        //     {
        //         addedAt: Date,
        //         userId: ObjectId,
        //         login: string
        //     }
        // ],
        const likesMap = postIds.reduce((acc, postId) => {
            acc[postId] = allLikes
                .filter(like => like.parentId.toString() === postId)
                .slice(0, 3) // Берем последние три лайка
                .map(like => ({
                    addedAt: like.createdAt,
                    userId: like.userId,
                    login: like.userLogin,
                }));
            return acc;
        }, {});

        // прохожусь по каждому посту, подбираю статус для каждого поста
        // маплю 3 типа данных в одну схему
        const mapPosts = await Promise.all(
            posts.map(async post => {
                const statusUser = userId
                    ? await this.statusModel
                          .findOne({ userId, parentId: post._id.toString() })
                          .then(status => (status ? transformStatus(status) : { status: StatusLike.enum['None'] }))
                    : null;
                return transformPostStatusUsers(post, statusUser, likesMap[post._id.toString()] || []);
            }),
        );

        return {
            pagesCount: pageCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount,
            items: mapPosts,
        };
    }
    async getPost(postId: string, userId?: string | null) {
        // нахожу искомый пост
        const postPromise = this.postModel.findOne({ _id: postId, deletionStatus: DeletionStatus.enum['not-deleted'] });

        // нахожу свой статус
        const myLikeStatusPromise = userId ? this.statusModel.findOne({ userId, parentId: postId }) : Promise.resolve(null);

        // забираю последние три лайка от юзеров
        const latestThreeLikesPromise = this.statusModel
            .find({ parentId: postId, status: StatusLike.enum['Like'] })
            .sort({ createdAt: -1 })
            .limit(3)
            .exec();

        const [post, myLikeStatus, latestThreeLikes] = await Promise.all([postPromise, myLikeStatusPromise, latestThreeLikesPromise]);

        if (!post) {
            throw NotFoundDomainException.create('Post not found', 'post');
        }

        // трансформирую в нужный вид!
        const transformedUsers = latestThreeLikes.map(user => statusesUsersMapper(user));

        // маплю данные!
        return transformPostStatusUsers(post, myLikeStatus, transformedUsers);
    }
}
