import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PaginatedBlogViewDto } from '../../../../../../core/dto/base.paginated.view-dto';
import { NotFoundDomainException } from '../../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { GetPostsQueryParams } from '../../../dto/api/get-posts-query-params.input.dto';
import { getPostsQuery } from '../../../../../../core/utils/post/query.insert.get';
import { PostViewDto } from '../../../dto/repository/post-view';
import { ParentTypes } from '../../../../../../libs/contracts/enums/parent.type.likes';
import { StatusLike } from '../../../../../../libs/contracts/enums/status.like';

@Injectable()
export class PostsQueryRepositoryOrm {
    constructor(@InjectDataSource() protected dataSource: DataSource) {}
    async getAllPosts(queryData: GetPostsQueryParams, userId: string | null, blogId?: string) {
        const updateQueryBlogId = blogId ? `AND p."blog_id" = ${blogId}` : ``;
        const { pageSize, pageNumber, sortBy, sortDirection } = getPostsQuery(queryData);

        function convertCamelCaseToSnakeCase(str: string) {
            const hardValueSortByTest = ['createdAt', 'shortDescription'];
            if (hardValueSortByTest.includes(sortBy)) return str.replace(/([A-Z])/g, '_\$1').toLowerCase();
            return str.toLowerCase();
        }

        // Проверяем, является ли sortBy допустимым значением
        const updatedSortBy = sortBy === 'blogName' ? `"${sortBy}"` : `p."${convertCamelCaseToSnakeCase(sortBy)}"`;

        const orderBy = `${updatedSortBy} ${sortDirection.toUpperCase()}`;

        const offset = (pageNumber - 1) * pageSize;

        const query = `
            SELECT
                p."id",
                p."title",
                p."short_description" AS "shortDescription",
                p."content",
                p."blog_id" AS "blogId",
                b."name" AS "blogName",
                p."created_at" AS "createdAt",
                COALESCE((SELECT status FROM likes WHERE parent_type = $1 AND post_id=p."id" AND user_id = $2), $3) AS "myStatus",
                SUM(CASE WHEN status = $4 AND parent_type = $5 THEN 1 ELSE 0 END) AS "likesCount",
                SUM(CASE WHEN status = $6 AND parent_type = $7 THEN 1 ELSE 0 END) AS "dislikesCount",
                (
                    SELECT json_agg(like_info)
                    FROM (
                             SELECT
                                 l."updated_at" AS "addedAt",
                                 l."user_id"::INT AS "userId",
                                 u."login"
                             FROM "likes" AS l
                                      JOIN "users" AS u ON l."user_id" = u."id"
                             WHERE l."post_id" = p."id" AND l."parent_type" = $8 AND l."status" = $9
                             ORDER BY l."updated_at" DESC
                             LIMIT 3
                         ) AS like_info
                ) AS "newestLikes"
            FROM "posts" AS p
                     LEFT JOIN "blogs" AS b ON b.id = p.blog_id
                     LEFT JOIN "likes" AS l ON p.id = l.post_id
            WHERE p."deleted_at" IS NULL ${updateQueryBlogId}
            GROUP BY p."id", b."name"
            ORDER BY ${orderBy}
            LIMIT $10
            OFFSET $11`;

        const resultPosts = await this.dataSource.query(query, [
            ParentTypes.enum['post'],
            userId,
            StatusLike.enum['None'],
            StatusLike.enum['Like'],
            ParentTypes.enum['post'],
            StatusLike.enum['Dislike'],
            ParentTypes.enum['post'],
            ParentTypes.enum['post'],
            StatusLike.enum['Like'],
            pageSize,
            offset,
        ]);

        const queryCount = `
            SELECT COUNT(*) AS "totalCount" 
            FROM "posts" p
            WHERE p."deleted_at" IS NULL ${updateQueryBlogId}`;

        const resultTotalCount = await this.dataSource.query(queryCount);

        const postsView = resultPosts.map(post => PostViewDto.mapToView(post));

        return PaginatedBlogViewDto.mapToView<PostViewDto[]>({
            items: postsView,
            page: pageNumber,
            size: pageSize,
            totalCount: +resultTotalCount[0].totalCount,
        });
    }

    async getPost(postId: string, userId: string | null) {
        const query = `
            SELECT
                p."id",
                p."title",
                p."short_description" AS "shortDescription",
                p."content",
                p."blog_id" AS "blogId",
                b."name" AS "blogName",
                p."created_at" AS "createdAt",
                COALESCE((SELECT status FROM likes WHERE parent_type = $1 AND post_id=p."id" AND user_id = $2), $3) AS "myStatus",
                SUM(CASE WHEN status = $4 AND parent_type = $5 THEN 1 ELSE 0 END) AS "likesCount",
                SUM(CASE WHEN status = $6 AND parent_type = $7 THEN 1 ELSE 0 END) AS "dislikesCount",
                (
                    SELECT json_agg(like_info)
                    FROM (
                             SELECT
                                 l."updated_at" AS "addedAt",
                                 l."user_id" AS "userId",
                                 u."login"
                             FROM "likes" AS l
                                      JOIN "users" AS u ON l."user_id" = u."id"
                             WHERE l."post_id" = p."id" AND l."parent_type" = $8 AND l."status" = $9
                             ORDER BY l."updated_at" DESC
                             LIMIT 3
                         ) AS like_info
                ) AS "newestLikes"
            FROM "posts" AS p
                     LEFT JOIN "blogs" AS b ON b.id = p.blog_id
                     LEFT JOIN "likes" AS l ON p.id = l.post_id
            WHERE p."deleted_at" IS NULL AND p."id" = $10
            GROUP BY p."id", b."name"`;

        const resultPost = await this.dataSource.query(query, [
            ParentTypes.enum['post'],
            userId,
            StatusLike.enum['None'],
            StatusLike.enum['Like'],
            ParentTypes.enum['post'],
            StatusLike.enum['Dislike'],
            ParentTypes.enum['post'],
            ParentTypes.enum['post'],
            StatusLike.enum['Like'],
            postId,
        ]);
        if (!resultPost || resultPost.length === 0) {
            throw NotFoundDomainException.create('Пост не найден', 'postId');
        }
        return PostViewDto.mapToView(resultPost[0]);
    }
}
