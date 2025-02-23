import { GetBlogsQueryParams } from '../../../dto/repository/query/get-blogs-query-params.input-dto';
import { InjectModel } from '@nestjs/mongoose';
import { BlogEntity, BlogModelType } from '../../../domain/blog.entity';
import { BlogViewDto } from '../../../dto/repository/query/blog-view.dto';
import { PaginatedBlogViewDto } from '../../../../../../core/dto/base.paginated.view-dto';
import { Injectable } from '@nestjs/common';
import { PaginationParams } from '../../../../../../core/dto/base.query-params.input-dto';
import { getBlogsQuery } from '../../../../../../core/utils/blog/query.insert.blog';
import { NotFoundDomainException } from '../../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { DeletionStatus } from '../../../../../../libs/contracts/enums/deletion-status.enum';

@Injectable()
export class BlogsQueryRepository {
    constructor(@InjectModel(BlogEntity.name) private readonly blogModel: BlogModelType) {}
    async getAllBlogs(queryData: GetBlogsQueryParams) {
        const { pageSize, pageNumber, searchNameTerm, sortBy, sortDirection } = getBlogsQuery(queryData);

        const filter: any = {};

        if (searchNameTerm) {
            filter.name = { $regex: searchNameTerm, $options: 'i' };
        }

        const blogsFromDb = await this.blogModel
            .find({ ...filter, deletionStatus: DeletionStatus.enum['not-deleted'] })
            .skip(PaginationParams.calculateSkip(queryData))
            .limit(pageSize)
            .sort({ [sortBy]: sortDirection });

        const blogsView = blogsFromDb.map(blog => BlogViewDto.mapToView(blog));

        const blogsCount = await this.getBlogsCount(searchNameTerm || null);

        return PaginatedBlogViewDto.mapToView({
            items: blogsView,
            page: pageNumber,
            size: pageSize,
            totalCount: blogsCount,
        });
    }
    async getBlog(id: string) {
        const blog = await this.blogModel.findOne({ _id: id, deletionStatus: DeletionStatus.enum['not-deleted'] });
        if (!blog) {
            throw NotFoundDomainException.create('Blog not found', 'blog');
        }
        return BlogViewDto.mapToView(blog);
    }
    private async getBlogsCount(searchNameTerm: string | null): Promise<number> {
        const filter: any = { deletionStatus: DeletionStatus.enum['not-deleted'] };

        if (searchNameTerm) {
            filter.name = { $regex: searchNameTerm, $options: 'i' };
        }

        return this.blogModel.countDocuments(filter);
    }
}
