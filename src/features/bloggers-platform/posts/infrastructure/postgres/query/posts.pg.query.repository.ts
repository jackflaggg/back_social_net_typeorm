import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PaginatedBlogViewDto } from '../../../../../../core/dto/base.paginated.view-dto';
import { NotFoundDomainException } from '../../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { GetPostsQueryParams } from '../../../dto/api/get-posts-query-params.input.dto';
import { getPostsQuery } from '../../../../../../core/utils/post/query.insert.get';
import { PostViewDto } from '../../../dto/repository/post-view';

@Injectable()
export class PostsPgQueryRepository {
    constructor(@InjectDataSource() protected dataSource: DataSource) {}
    async getAllPosts(queryData: GetPostsQueryParams, blogId?: string) {
        const { pageSize, pageNumber, sortBy, sortDirection } = getPostsQuery(queryData);

        // Проверяем, является ли sortBy допустимым значением
        const updatedSortBy = sortBy === 'blogName' ? `"${sortBy}"` : `"${sortBy}"`;

        const offset = (pageNumber - 1) * pageSize;

        let queryPosts = `
        SELECT p."id",
               p."title"                AS title,
               p."short_description"    AS "shortDescription",
               p."content"              AS content,
               p."blog_id"              AS "blogId",
               b."name"                 AS "blogName",
               p."created_at"           AS "createdAt"
        FROM "posts" AS p
        JOIN "blogs" AS b 
            ON b.id = p.blog_id
        WHERE p."deleted_at" IS NULL`;

        const queryParams: number[] = [];

        if (blogId) {
            queryPosts += ` AND b.id = $1`;
            queryParams.push(+blogId);
        }

        // Убедитесь, что вы правильно указываете таблицу в ORDER BY
        queryPosts += `
        ORDER BY ${updatedSortBy} ${sortDirection.toUpperCase()}
        LIMIT $${queryParams.length + 1}
        OFFSET $${queryParams.length + 2}
    `;

        queryParams.push(Number(pageSize), Number(offset));

        const resultPosts = await this.dataSource.query(queryPosts, queryParams);

        const queryCount = `
        SELECT COUNT(*) AS "totalCount" FROM "posts" WHERE "deleted_at" IS NULL
    `;
        const resultTotal = await this.dataSource.query(queryCount);

        const postsView = resultPosts.map(post => PostViewDto.mapToView(post));

        return PaginatedBlogViewDto.mapToView<PostViewDto[]>({
            items: postsView,
            page: pageNumber,
            size: pageSize,
            totalCount: +resultTotal[0].totalCount,
        });
    }

    async getPost(postId: string) {
        const query = `SELECT p."id", p."title", p."short_description" AS "shortDescription", p."content", p."blog_id" AS "blogId", b."name" as "blogName", p."created_at" AS "createdAt" FROM "posts" AS p JOIN "blogs" b on b.id = p.blog_id WHERE p.id = $1 AND p."deleted_at" IS NULL `;
        const result = await this.dataSource.query(query, [postId]);
        if (!result || result.length === 0) {
            throw NotFoundDomainException.create('Пост не найден', 'blogId');
        }
        return PostViewDto.mapToView(result[0]);
    }
}
