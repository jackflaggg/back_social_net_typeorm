import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { SETTINGS } from '../../../../core/settings';
import { CommandBus } from '@nestjs/cqrs';
import { GetBlogsQueryParams } from '../dto/repository/query/get-blogs-query-params.input-dto';
import { ValidateSerialPipe } from '../../../../core/pipes/validation.input.serial';
import { BasicAuthGuard } from '../../../../core/guards/passport/guards/basic.auth.guard';
import { BlogCreateDtoApi } from '../dto/api/blog.create.dto';
import { CreateBlogCommand } from '../application/usecases/create-blog.usecase';
import { BlogUpdateDtoApi } from '../dto/api/blog.update.dto';
import { UpdateBlogCommand } from '../application/usecases/update-blog.usecase';
import { DeleteBlogCommand } from '../application/usecases/delete-blog.usecase';
import { GetPostsQueryParams } from '../../posts/dto/api/get-posts-query-params.input.dto';
import { CreatePostToBlogCommand } from '../application/usecases/create-post-to-blog.usecase';
import { PostToBlogCreateDtoApi } from '../dto/api/blog.to.post.create.dto';
import { PostUpdateDtoApi } from '../../posts/dto/api/post.update.dto';
import { UpdatePostToBlogCommand } from '../application/usecases/update-post-to-blog.usecase';
import { DeletePostToBlogCommand } from '../application/usecases/delete-post-to-blog.usecase';
import { JwtOptionalAuthGuard } from '../../../../core/guards/optional/jwt-optional-auth.guard';
import { ExtractAnyUserFromRequest } from '../../../../core/decorators/param/validate.user.decorators';
import { UserJwtPayloadDto } from '../../../user-accounts/strategies/refresh.strategy';
import { BlogsQueryRepositoryOrm } from '../infrastructure/typeorm/query/blogs.pg.query.repository';
import { PostsQueryRepositoryOrm } from '../../posts/infrastructure/typeorm/query/posts.pg.query.repository';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { BlogOutInterface, BlogViewDto } from '../dto/repository/query/blog-view.dto';
import { postOutInterface, PostViewDto } from '../../posts/dto/repository/post-view';

@Controller(SETTINGS.PATH.SA_BLOGS)
@UseGuards(BasicAuthGuard)
export class BlogsSaController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly blogsQueryRepository: BlogsQueryRepositoryOrm,
        private readonly postsQueryRepository: PostsQueryRepositoryOrm,
    ) {}

    @Get()
    async getBlogs(@Query() query: GetBlogsQueryParams): Promise<PaginatedViewDto<BlogViewDto[]>> {
        return this.blogsQueryRepository.getAllBlogs(query);
    }

    @HttpCode(HttpStatus.CREATED)
    @Post()
    async createBlog(@Body() dto: BlogCreateDtoApi): Promise<BlogOutInterface> {
        const blogId = await this.commandBus.execute(new CreateBlogCommand(dto));
        return this.blogsQueryRepository.getBlog(blogId);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Put(':blogId')
    async updateBlog(@Param('blogId', ValidateSerialPipe) blogId: string, @Body() dto: BlogUpdateDtoApi) {
        return this.commandBus.execute(new UpdateBlogCommand(blogId, dto));
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':blogId')
    async deleteBlog(@Param('blogId', ValidateSerialPipe) blogId: string) {
        return this.commandBus.execute(new DeleteBlogCommand(blogId));
    }

    @UseGuards(JwtOptionalAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    @Post(':blogId/posts')
    async createPostToBlog(
        @Param('blogId', ValidateSerialPipe) blogId: string,
        @Body() dto: PostToBlogCreateDtoApi,
        @ExtractAnyUserFromRequest() dtoUser: UserJwtPayloadDto,
    ) {
        const userId: string | null = dtoUser ? dtoUser.userId : null;
        const postId: string = await this.commandBus.execute(new CreatePostToBlogCommand(blogId, dto));
        return this.postsQueryRepository.getPost(postId, userId);
    }

    @UseGuards(JwtOptionalAuthGuard)
    @Get(':blogId/posts')
    async getPosts(
        @Param('blogId', ValidateSerialPipe) blogId: string,
        @Query() query: GetPostsQueryParams,
        @ExtractAnyUserFromRequest() user: UserJwtPayloadDto,
    ) {
        const userId: string | null = user ? user.userId : null;
        const blog: BlogOutInterface = await this.blogsQueryRepository.getBlog(blogId);
        return this.postsQueryRepository.getAllPosts(query, userId, blog.id);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Put(':blogId/posts/:postId')
    async updatePostToBlog(
        @Param('blogId', ValidateSerialPipe) blogId: string,
        @Param('postId', ValidateSerialPipe) postId: string,
        @Body() dto: PostUpdateDtoApi,
    ): Promise<void> {
        return this.commandBus.execute(new UpdatePostToBlogCommand(blogId, postId, dto));
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':blogId/posts/:postId')
    async deletePostToBlog(@Param('blogId', ValidateSerialPipe) blogId: string, @Param('postId', ValidateSerialPipe) postId: string) {
        return this.commandBus.execute(new DeletePostToBlogCommand(blogId, postId));
    }
}
