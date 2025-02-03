import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { BlogUpdateDtoApi } from '../dto/api/blog.update.dto';
import { BlogCreateDtoApi } from '../dto/api/blog.create.dto';
import { BlogsQueryRepository } from '../infrastructure/query/blogs.query-repository';
import { GetBlogsQueryParams } from '../dto/repository/query/get-blogs-query-params.input-dto';
import { PostToBlogCreateDtoApi } from '../dto/api/blog.to.post.create.dto';
import { PostsQueryRepository } from '../../posts/infrastructure/query/posts.query-repository';
import { GetPostsQueryParams } from '../../posts/dto/api/get-posts-query-params.input.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogCommand } from '../application/usecases/create-blog.usecase';
import { CreatePostToBlogCommand } from '../application/usecases/create-post-to-blog.usecase';
import { DeleteBlogCommand } from '../application/usecases/delete-blog.usecase';
import { UpdateBlogCommand } from '../application/usecases/update-blog.usecase';
import { BasicAuthGuard } from '../../../../core/guards/passport/guards/basic.auth.guard';
import { ValidateObjectIdPipe } from '../../../../core/pipes/validation.input.data.pipe';
import { ExtractAnyUserFromRequest, ExtractUserFromRequest } from '../../../../core/decorators/param/validate.user.decorators';
import { UserJwtPayloadDto } from '../../../user-accounts/strategies/refresh.strategy';
import { JwtOptionalAuthGuard } from '../../../../core/guards/optional/jwt-optional-auth.guard';

@Controller('blogs')
export class BlogsController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly blogsQueryRepository: BlogsQueryRepository,
        private readonly postsQueryRepository: PostsQueryRepository,
    ) {}

    @Get()
    async getBlogs(@Query() query: GetBlogsQueryParams) {
        return this.blogsQueryRepository.getAllBlogs(query);
    }

    @UseGuards(JwtOptionalAuthGuard)
    @Get(':blogId/posts')
    async getPosts(
        @Param('blogId', ValidateObjectIdPipe) blogId: string,
        @Query() query: GetPostsQueryParams,
        @ExtractAnyUserFromRequest() dto: UserJwtPayloadDto,
    ) {
        const blog = await this.blogsQueryRepository.getBlog(blogId);
        const userId = dto ? dto.userId : null;
        return this.postsQueryRepository.getAllPosts(query, userId, blog.id);
    }

    @Get(':blogId')
    async getBlog(@Param('blogId', ValidateObjectIdPipe) blogId: string) {
        return this.blogsQueryRepository.getBlog(blogId);
    }

    @HttpCode(HttpStatus.CREATED)
    @UseGuards(BasicAuthGuard)
    @Post()
    async createBlog(@Body() dto: BlogCreateDtoApi) {
        const blogId = await this.commandBus.execute(new CreateBlogCommand(dto));
        return this.blogsQueryRepository.getBlog(blogId);
    }

    @HttpCode(HttpStatus.CREATED)
    @UseGuards(BasicAuthGuard)
    @Post(':blogId/posts')
    async createPostToBlog(@Param('blogId', ValidateObjectIdPipe) blogId: string, @Body() dto: PostToBlogCreateDtoApi) {
        const postId = await this.commandBus.execute(new CreatePostToBlogCommand(blogId, dto));
        return this.postsQueryRepository.getPost(postId);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(BasicAuthGuard)
    @Put(':blogId')
    async updateBlog(@Param('blogId', ValidateObjectIdPipe) blogId: string, @Body() dto: BlogUpdateDtoApi) {
        return this.commandBus.execute(new UpdateBlogCommand(blogId, dto));
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(BasicAuthGuard)
    @Delete(':blogId')
    async deleteBlog(@Param('blogId', ValidateObjectIdPipe) blogId: string) {
        return this.commandBus.execute(new DeleteBlogCommand(blogId));
    }
}
