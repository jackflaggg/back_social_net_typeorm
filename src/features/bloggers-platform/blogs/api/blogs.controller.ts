import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { GetBlogsQueryParams } from '../dto/repository/query/get-blogs-query-params.input-dto';
import { GetPostsQueryParams } from '../../posts/dto/api/get-posts-query-params.input.dto';
import { ExtractAnyUserFromRequest } from '../../../../core/decorators/param/validate.user.decorators';
import { UserJwtPayloadDto } from '../../../user-accounts/strategies/refresh.strategy';
import { JwtOptionalAuthGuard } from '../../../../core/guards/optional/jwt-optional-auth.guard';
import { SETTINGS } from '../../../../core/settings';
import { BlogsQueryRepositoryOrm } from '../infrastructure/typeorm/query/blogs.pg.query.repository';
import { PostsQueryRepositoryOrm } from '../../posts/infrastructure/typeorm/query/posts.pg.query.repository';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { BlogOutInterface, BlogViewDto } from '../dto/repository/query/blog-view.dto';
import { ValidateUUIDPipe } from '../../../../core/pipes/validation.input.uuid';

@Controller(SETTINGS.PATH.BLOGS)
export class BlogsController {
    constructor(
        private readonly blogsQueryRepository: BlogsQueryRepositoryOrm,
        private readonly postsQueryRepository: PostsQueryRepositoryOrm,
    ) {}

    @Get()
    async getBlogs(@Query() query: GetBlogsQueryParams): Promise<PaginatedViewDto<BlogViewDto[]>> {
        return this.blogsQueryRepository.getAllBlogs(query);
    }

    @UseGuards(JwtOptionalAuthGuard)
    @Get(':blogId/posts')
    async getPosts(
        @Param('blogId', ValidateUUIDPipe) blogId: string,
        @Query() query: GetPostsQueryParams,
        @ExtractAnyUserFromRequest() user: UserJwtPayloadDto,
    ) {
        const userId = user ? user.userId : '';
        const blog = await this.blogsQueryRepository.getBlog(blogId);
        return this.postsQueryRepository.getAllPosts(query, userId, blog.id);
    }

    @Get(':blogId')
    async getBlog(@Param('blogId', ValidateUUIDPipe) blogId: string): Promise<BlogOutInterface> {
        return this.blogsQueryRepository.getBlog(blogId);
    }
}
