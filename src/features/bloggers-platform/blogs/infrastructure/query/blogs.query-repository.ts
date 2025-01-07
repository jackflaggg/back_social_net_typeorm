import { GetBlogsQueryParams } from '../../dto/api/get-blogs-query-params.input-dto';
import { InjectModel } from '@nestjs/mongoose';
import { BlogEntity, BlogModelType } from '../../domain/blog.entity';
import { DeletionStatus } from '@libs/contracts/enums/deletion-status.enum';
import { BlogViewDto } from '../../dto/api/blog-view.dto';
import { PaginatedBlogViewDto } from '../../../../../core/dto/base.paginated.view-dto';

export class BlogsQueryRepository {
    constructor(@InjectModel(BlogEntity.name) private readonly blogModel: BlogModelType) {}
    async getAllBlogs(queryData: GetBlogsQueryParams) {
        const { pageSize, pageNumber, searchNameTerm, sortBy, sortDirection } = queryData;

        const filter: any = {};

        if (searchNameTerm) {
            filter.name = { $regex: searchNameTerm, $options: 'i' };
        }

        const blogsFromDb = await this.blogModel
            .find({ ...filter, deletionStatus: DeletionStatus['not-deleted'] })
            .skip(queryData.calculateSkip())
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
        const blog = this.blogModel.findById({ _id: id });
        if (!blog) {
            return void 0;
        }
        return blog;
    }
    private async getBlogsCount(searchNameTerm: string | null): Promise<number> {
        const filter: any = { deletionStatus: DeletionStatus['not-deleted'] };

        if (searchNameTerm) {
            filter.name = { $regex: searchNameTerm, $options: 'i' };
        }

        return await this.blogModel.countDocuments(filter);
    }
}
