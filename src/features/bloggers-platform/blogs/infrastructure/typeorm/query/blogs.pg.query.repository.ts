import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { BlogIntInterface, BlogOutInterface, BlogViewDto } from '../../../dto/repository/query/blog-view.dto';
import { GetBlogsQueryParams } from '../../../dto/repository/query/get-blogs-query-params.input-dto';
import { PaginatedBlogViewDto, PaginatedViewDto } from '../../../../../../core/dto/base.paginated.view-dto';
import { NotFoundDomainException } from '../../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { Blog } from '../../../domain/typeorm/blog.entity';
import { getBlogsQuery } from '../../../utils/blog/query.insert.blog';
import { PaginationParams } from '../../../../../../core/dto/base.query-params.input-dto';

@Injectable()
export class BlogsQueryRepositoryOrm {
    constructor(@InjectRepository(Blog) private blogsQueryRepositoryTypeOrm: Repository<Blog>) {}

    async getAllBlogs(queryData: GetBlogsQueryParams): Promise<PaginatedViewDto<BlogViewDto[]>> {
        const { pageSize, pageNumber, searchNameTerm, sortBy, sortDirection } = getBlogsQuery(queryData);

        const offset = PaginationParams.calculateSkip({ pageNumber, pageSize });

        const queryBuilder = this.blogsQueryRepositoryTypeOrm.createQueryBuilder('b').where('b.deleted_at IS NULL');

        if (searchNameTerm) {
            queryBuilder.andWhere(
                new Brackets(qb => {
                    qb.where('b.name ILIKE :name', { name: `%${searchNameTerm}%` });
                }),
            );
        }

        const resultBlogs = await queryBuilder
            .select([
                'b.id AS id, b.name AS name, b.description AS description, b.website_url AS "websiteUrl", b.is_membership AS "isMembership", b.created_at as "createdAt"',
            ])
            .orderBy(`b.${sortBy}`, sortDirection)
            .skip(offset)
            .take(pageSize)
            .getRawMany();

        const totalCount = await queryBuilder.getCount();

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
                'b.id AS id, b.name AS name, b.description AS description, b.website_url AS "websiteUrl", b.is_membership AS "isMembership", b.created_at as "createdAt"',
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
