import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BlogIntInterface, BlogOutInterface, BlogViewDto } from '../../../dto/repository/query/blog-view.dto';
import { GetBlogsQueryParams } from '../../../dto/repository/query/get-blogs-query-params.input-dto';
import { getBlogsQuery } from '../../../../../../core/utils/blog/query.insert.blog';
import { PaginatedBlogViewDto, PaginatedViewDto } from '../../../../../../core/dto/base.paginated.view-dto';
import { NotFoundDomainException } from '../../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { Blog } from '../../../domain/typeorm/blog.entity';

@Injectable()
export class BlogsQueryRepositoryOrm {
    constructor(@InjectRepository(Blog) private blogsQueryRepositoryTypeOrm: Repository<Blog>) {}

    async getAllBlogs(queryData: GetBlogsQueryParams): Promise<PaginatedViewDto<BlogViewDto[]>> {
        const { pageSize, pageNumber, searchNameTerm, sortBy, sortDirection } = getBlogsQuery(queryData);

        const updatedSortBy = sortBy === 'createdAt' ? 'created_at' : sortBy.toLowerCase();

        const offset = (pageNumber - 1) * pageSize;

        const queryBlogs = `
            SELECT "id", "name", "description", "website_url" AS "websiteUrl", "created_at" AS "createdAt", "is_membership" AS "isMembership" FROM "blogs" WHERE "deleted_at" IS NULL AND ("name" ILIKE '%' || $1 || '%')
            ORDER BY ("${updatedSortBy}") ${sortDirection.toUpperCase()}
            LIMIT $2
            OFFSET $3
            `;

        const resultBlogs = await this.blogsQueryRepositoryTypeOrm.query(queryBlogs, [searchNameTerm, Number(pageSize), Number(offset)]);

        const queryCount = `
            SELECT COUNT(*) AS "totalCount" FROM "blogs" WHERE "deleted_at" IS NULL AND ("name" ILIKE '%' || $1 || '%')
        `;
        const resultTotal = await this.blogsQueryRepositoryTypeOrm.query(queryCount, [searchNameTerm]);

        const blogsView = resultBlogs.map((blog: BlogIntInterface) => BlogViewDto.mapToView(blog));

        return PaginatedBlogViewDto.mapToView<BlogViewDto[]>({
            items: blogsView,
            page: pageNumber,
            size: pageSize,
            totalCount: +resultTotal[0].totalCount,
        });
    }
    async getBlog(blogId: string): Promise<BlogOutInterface> {
        const query = `SELECT "id", "name", "description", "website_url" AS "websiteUrl", "created_at" AS "createdAt", "is_membership" AS "isMembership" FROM "blogs" WHERE id = $1 AND "deleted_at" IS NULL`;

        const result = await this.blogsQueryRepositoryTypeOrm.query(query, [Number(blogId)]);

        if (!result || result.length === 0) {
            throw NotFoundDomainException.create('блог не найден', 'blogId');
        }

        return BlogViewDto.mapToView(result[0]);
    }
}
