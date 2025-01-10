import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeletionStatus } from '@libs/contracts/enums/deletion-status.enum';
import { PaginatedBlogViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { PostEntity, PostModelType } from '../../domain/post.entity';
import { GetPostsQueryParams } from '../../dto/api/get-posts-query-params.input.dto';
import { PostViewDto } from '../../dto/repository/post-view';
import { PaginationParams } from '../../../../../core/dto/base.query-params.input-dto';
import { getPostsQuery } from '../../../../../core/utils/post/query.insert.get';

@Injectable()
export class PostsQueryRepository {
    constructor(@InjectModel(PostEntity.name) private readonly postModel: PostModelType) {}
    async getAllPosts(queryData: GetPostsQueryParams, blogId?: string) {
        const { pageSize, pageNumber, sortBy, sortDirection } = getPostsQuery(queryData);

        const filter = this.getFilter(blogId);

        const postsFromDb = await this.postModel
            .find({ ...filter })
            .skip(PaginationParams.calculateSkip(queryData) ?? (pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({ [sortBy]: sortDirection });

        const postsView = postsFromDb.map(post => PostViewDto.mapToView(post));

        const postsCount = await this.postModel.countDocuments({ ...filter });

        return PaginatedBlogViewDto.mapToView({
            items: postsView,
            page: pageNumber,
            size: pageSize,
            totalCount: postsCount,
        });
    }
    async getPost(id: string) {
        const post = await this.postModel.findOne({ _id: id, deletionStatus: DeletionStatus.enum['not-deleted'] });
        if (!post) {
            return void 0;
        }
        return PostViewDto.mapToView(post);
    }
    private getFilter(blogId?: string) {
        const filter: any = { deletionStatus: DeletionStatus.enum['not-deleted'] };
        if (blogId) {
            filter.blogId = blogId;
        }
        return filter;
    }
}
