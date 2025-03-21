import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogIntInterface, BlogOutInterface, BlogViewDto } from '../../../dto/repository/query/blog-view.dto';
import { GetBlogsQueryParams } from '../../../dto/repository/query/get-blogs-query-params.input-dto';
import { PaginatedBlogViewDto, PaginatedViewDto } from '../../../../../../core/dto/base.paginated.view-dto';
import { NotFoundDomainException } from '../../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { Blog } from '../../../domain/typeorm/blog.entity';
import { getBlogsQuery } from '../../../utils/blog/query.insert.blog';

@Injectable()
export class BlogsQueryRepositoryOrm {
    constructor(@InjectRepository(Blog) private blogsQueryRepositoryTypeOrm: Repository<Blog>) {}

    async getAllBlogs(queryData: GetBlogsQueryParams): Promise<PaginatedViewDto<BlogViewDto[]>> {
        const { pageSize, pageNumber, searchNameTerm, sortBy, sortDirection } = getBlogsQuery(queryData);

        const updatedSortBy = sortBy === 'createdAt' ? 'created_at' : sortBy.toLowerCase();

        const offset = (pageNumber - 1) * pageSize;

        const cteToCountBlogs = '(SELECT COUNT(*) FROM blogs WHERE deleted_at IS NULL AND (title ILIKE :title)) AS totalCount';

        const resultBlogs = await this.blogsQueryRepositoryTypeOrm
            .createQueryBuilder('b')
            .select([
                'b.id AS id, b.name AS name, b.description AS description, b.website_url AS websiteUrl, b.is_membership AS isMembership, b.created_at as createdAt',
                cteToCountBlogs,
            ])
            .where('b.deleted_at IS NULL')
            .andWhere('b.title ILIKE :title', { title: `%${searchNameTerm}%` })
            .orderBy(`b.${updatedSortBy}`, sortDirection)
            .skip(offset)
            .take(pageSize)
            .getRawMany();

        const totalCount = resultBlogs.length > 0 ? Number(resultBlogs[0].totalcount) : 0;

        const blogsView = resultBlogs.map((blog: BlogIntInterface) => BlogViewDto.mapToView(blog));

        return PaginatedBlogViewDto.mapToView<BlogViewDto[]>({
            items: blogsView,
            page: pageNumber,
            size: pageSize,
            totalCount: totalCount,
        });
    }
    async getBlog(blogId: string): Promise<BlogOutInterface> {
        const result = await this.blogsQueryRepositoryTypeOrm
            .createQueryBuilder('b')
            .select([
                'b.id AS id, b.name AS name, b.description AS description, b.website_url AS websiteUrl, b.is_membership AS isMembership, b.created_at as createdAt',
            ])
            .where('b.deleted_at IS NULL')
            .andWhere('b.id = :blogId', { blogId })
            .getRawOne();

        if (!result) {
            throw NotFoundDomainException.create('блог не найден', 'blogId');
        }

        return BlogViewDto.mapToView(result);
    }
}
