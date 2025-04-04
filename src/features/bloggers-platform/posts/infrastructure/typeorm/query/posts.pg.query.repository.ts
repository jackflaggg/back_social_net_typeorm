import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { GetPostsQueryParams } from '../../../dto/api/get-posts-query-params.input.dto';
import { PostViewDto } from '../../../dto/repository/post-view';
import { getPostsQuery } from '../../../utils/post/query.insert.get';
import { Post } from '../../../domain/typeorm/post.entity';
import { NotFoundDomainException } from '../../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { Blog } from '../../../../blogs/domain/typeorm/blog.entity';
import { PaginatedPostViewDto } from '../../../../../../core/dto/base.paginated.view-dto';
import { PaginationParams, SortDirection } from '../../../../../../core/dto/base.query-params.input-dto';
import { StatusLike } from '../../../../../../libs/contracts/enums/status/status.like';
import { PostStatus } from '../../../../likes/domain/typeorm/posts/post.status.entity';
import { User } from '../../../../../user-accounts/domain/typeorm/user/user.entity';

@Injectable()
export class PostsQueryRepositoryOrm {
    constructor(@InjectRepository(Post) protected postRepositoryOrm: Repository<Post>) {}

    async getAllPosts(queryData: GetPostsQueryParams, userId?: string, blogId?: string) /*: Promise<PaginatedViewDto<PostViewDto[]>>*/ {
        const { pageSize, pageNumber, sortBy, sortDirection } = getPostsQuery(queryData);

        const offset = PaginationParams.calculateSkip({ pageNumber, pageSize });

        const updatedSortBy = sortBy === 'blog_name' ? `b.name` : `p.${sortBy}`;

        const queryBuilder = this.postRepositoryOrm.createQueryBuilder('p').where('p.deleted_at IS NULL');

        if (blogId) {
            queryBuilder.andWhere(
                new Brackets(qb => {
                    qb.where('b.id = p.blog_id', { blogId });
                }),
            );
        }

        const resultPosts = await queryBuilder
            .select([
                'p.id AS id, p.title AS title, p.short_description AS "shortDescription", p.content AS content, p.created_at AS "createdAt", p.blog_id AS "blogId", b.name AS "blogName"',
            ])
            .leftJoin(Blog, 'b', 'b.id = p.blog_id')
            .orderBy(updatedSortBy, sortDirection)
            .limit(pageSize)
            .offset(offset)
            .getRawMany();

        const totalCount = await queryBuilder.getCount();

        const postsView = resultPosts.map(user => PostViewDto.mapToView(user));

        return PaginatedPostViewDto.mapToView<PostViewDto[]>({
            items: postsView,
            page: pageNumber,
            size: pageSize,
            totalCount,
        });
    }

    async getPost(postId: string, userId?: string) {
        const queryBuilder = this.postRepositoryOrm
            .createQueryBuilder('p')
            .select([
                'p.id AS id, p.title AS title, p.short_description AS "shortDescription", p.content AS content, p.created_at AS "createdAt", p.blog_id AS "blogId", b.name AS "blogName"',
            ])
            .leftJoin(Blog, 'b', 'b.id = p.blog_id')
            .where('p.deleted_at IS NULL AND p.id = :postId', { postId })
            .groupBy('p.id, b.name');

        if (userId) {
            queryBuilder.addSelect(subQuery => {
                return subQuery
                    .select(`COALESCE(status, '${StatusLike.enum['None']}')`)
                    .from(PostStatus, 'ps')
                    .where('p.id = ps.post_id')
                    .andWhere('ps.user_id = :userId', { userId });
            }, 'myStatus');
        } else {
            queryBuilder.addSelect(`'${StatusLike.enum['None']}'`, 'myStatus');
        }

        queryBuilder
            .addSelect(qb => {
                return qb
                    .select('COUNT(status)')
                    .from(PostStatus, 'ps')
                    .where('ps.status = :likeStatuses AND ps.post_id = p.id', { likeStatuses: StatusLike.enum['Like'] });
            }, 'likesCount')
            .addSelect(qb => {
                return qb
                    .select('COUNT(status)')
                    .from(PostStatus, 'ps')
                    .where('ps.status = :dislikeStatuses AND ps.post_id = p.id', { dislikeStatuses: StatusLike.enum['Dislike'] });
            }, 'dislikesCount');
        /*.addSelect(qb => {
                return qb
                    .select("json_agg(json_build_object('addedAt', ps.created_at, 'userId', ps.user_id, 'login', u.login))")
                    .from(PostStatus, 'ps')
                    .innerJoin(User, 'u', 'ps.user_id = u.id')
                    .where(`ps.post_id = p.id AND ps.status = :likeStatus`, { likeStatus: StatusLike.enum['Like'] })
                    .orderBy('ps.created_at', SortDirection.Desc)
                    .limit(3);
            }, 'newestLikes');*/

        const result = await queryBuilder.getRawOne();

        if (!result) {
            throw NotFoundDomainException.create('пост не найден', 'postId');
        }

        return PostViewDto.mapToView(result);
    }
}
