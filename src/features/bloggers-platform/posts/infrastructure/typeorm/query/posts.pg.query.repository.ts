import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
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

        const updatedSortBy = sortBy === 'blog_name' ? `"blogName"` : `p.${sortBy}`;

        const queryBuilder = this.postRepositoryOrm
            .createQueryBuilder('p')
            .select([
                'p.id AS id, p.title AS title, p.short_description AS "shortDescription", p.content AS content, p.created_at AS "createdAt", p.blog_id AS "blogId"',
            ])
            .where('p.deleted_at IS NULL')
            .limit(pageSize)
            .offset(offset);

        if (blogId) {
            queryBuilder.andWhere(
                new Brackets(qb => {
                    qb.where('p.blog_id = :blogId', { blogId });
                }),
            );
        }

        const resultPosts = await queryBuilder
            .addSelect(this.getBlogName, 'blogName')
            .addSelect(this.getLikesCount, 'likesCount')
            .addSelect(this.getNewestLikes, 'newestLikes')
            .addSelect(this.getDislikesCount, 'dislikesCount')
            .addSelect(this.getMyStatus(userId), 'myStatus')
            .orderBy(updatedSortBy, sortDirection)
            .getRawMany();

        const totalCount = await queryBuilder.getCount();

        const postsView = resultPosts.map(post => PostViewDto.mapToView(post));

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
                'p.id AS id, p.title AS title, p.short_description AS "shortDescription", p.content AS content, p.created_at AS "createdAt", p.blog_id AS "blogId"',
            ])
            .where('p.deleted_at IS NULL AND p.id = :postId', { postId });

        const post = await queryBuilder
            .addSelect(this.getBlogName, 'blogName')
            .addSelect(this.getLikesCount, 'likesCount')
            .addSelect(this.getNewestLikes, 'newestLikes')
            .addSelect(this.getDislikesCount, 'dislikesCount')
            .addSelect(this.getMyStatus(userId), 'myStatus')
            .getRawOne();

        if (!post) {
            throw NotFoundDomainException.create('пост не найден', 'postId');
        }

        return PostViewDto.mapToView(post);
    }

    private getBlogName(queryBuilder: SelectQueryBuilder<Post>) {
        return queryBuilder.select(`b.name as "blogName"`).from(Blog, `b`).where(`b.id = p.blog_id`);
    }

    private getLikesCount(queryBuilder: SelectQueryBuilder<Post>) {
        return queryBuilder
            .select(`COUNT(status)::INT as "statusLike"`)
            .from(PostStatus, `ps`)
            .where(`p.id = ps.post_id AND ps.status = :likeStatus`, { likeStatus: StatusLike.enum['Like'] });
    }

    private getDislikesCount(queryBuilder: SelectQueryBuilder<Post>) {
        return queryBuilder
            .select(`COUNT(status)::INT as "statusDislike"`)
            .from(PostStatus, `ps`)
            .where(`p.id = ps.post_id AND ps.status = :dislikeStatus`, { dislikeStatus: StatusLike.enum['Dislike'] });
    }

    private getMyStatus = (userId?: string) => (queryBuilder: SelectQueryBuilder<Post>) => {
        if (!userId) {
            return queryBuilder.select(`'${StatusLike.enum['None']}' AS "statusUser"`).from(PostStatus, 'ps').limit(1);
        }
        return queryBuilder
            .select(`ps.status AS "statusUser"`)
            .from(PostStatus, 'ps')
            .where(`ps.user_id = :userId AND ps.post_id = p.id`, { userId })
            .limit(1);
    };

    private getNewestLikes(queryBuilder: SelectQueryBuilder<Post>) {
        const cteUserLogin = qb => qb.select('u.login').from(User, 'u').where('u.id = ps.user_id');

        return queryBuilder
            .select(`jsonb_agg(json_build_object('userId', nl."user_id", 'addedAt', nl."created_at", 'login', nl."userLogin"))`)
            .from(
                qb =>
                    qb
                        .select('ps.*')
                        .addSelect(cteUserLogin, 'userLogin')
                        .from(PostStatus, 'ps')
                        .where(`ps.post_id = p.id AND ps.status = '${StatusLike.enum['Like']}'`)
                        .orderBy('ps.created_at', `${SortDirection.Desc}`)
                        .limit(3),
                `nl`,
            );
    }
}
