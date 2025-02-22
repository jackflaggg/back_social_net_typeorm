import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { SETTINGS } from '../../../../core/settings';
import { CommandBus } from '@nestjs/cqrs';
import { BlogsPgQueryRepository } from '../infrastructure/postgres/query/blogs.pg.query.repository';
import { PostsPgQueryRepository } from '../../posts/infrastructure/postgres/query/posts.pg.query.repository';
import { GetBlogsQueryParams } from '../dto/repository/query/get-blogs-query-params.input-dto';
import { ValidateSerialPipe } from '../../../../core/pipes/validation.input.serial';
import { BasicAuthGuard } from '../../../../core/guards/passport/guards/basic.auth.guard';
import { BlogCreateDtoApi } from '../dto/api/blog.create.dto';
import { CreateBlogCommand } from '../application/usecases/create-blog.usecase';
import { BlogUpdateDtoApi } from '../dto/api/blog.update.dto';
import { UpdateBlogCommand } from '../application/usecases/update-blog.usecase';
import { DeleteBlogCommand } from '../application/usecases/delete-blog.usecase';
import { JwtOptionalAuthGuard } from '../../../../core/guards/optional/jwt-optional-auth.guard';
import { GetPostsQueryParams } from '../../posts/dto/api/get-posts-query-params.input.dto';
import { ExtractAnyUserFromRequest } from '../../../../core/decorators/param/validate.user.decorators';
import { UserJwtPayloadDto } from '../../../user-accounts/strategies/refresh.strategy';
import { CreatePostToBlogCommand } from '../application/usecases/create-post-to-blog.usecase';
import { PostToBlogCreateDtoApi } from '../dto/api/blog.to.post.create.dto';

@Controller(SETTINGS.PATH.SA_BLOGS)
export class BlogsSaController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly blogsQueryRepository: BlogsPgQueryRepository,
        private readonly postsQueryRepository: PostsPgQueryRepository,
    ) {}

    // мне нужно, чтоб этот роут был чисто по blogs, а остальные по /sa/blogs
    @Get()
    async getBlogs(@Query() query: GetBlogsQueryParams) {
        return this.blogsQueryRepository.getAllBlogs(query);
    }

    @HttpCode(HttpStatus.CREATED)
    @UseGuards(BasicAuthGuard)
    @Post()
    async createBlog(@Body() dto: BlogCreateDtoApi) {
        const blogId = await this.commandBus.execute(new CreateBlogCommand(dto));
        return this.blogsQueryRepository.getBlog(blogId);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(BasicAuthGuard)
    @Put(':blogId')
    async updateBlog(@Param('blogId', ValidateSerialPipe) blogId: string, @Body() dto: BlogUpdateDtoApi) {
        return this.commandBus.execute(new UpdateBlogCommand(blogId, dto));
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(BasicAuthGuard)
    @Delete(':blogId')
    async deleteBlog(@Param('blogId', ValidateSerialPipe) blogId: string) {
        return this.commandBus.execute(new DeleteBlogCommand(blogId));
    }

    @HttpCode(HttpStatus.CREATED)
    @UseGuards(BasicAuthGuard)
    @Post(':blogId/posts')
    async createPostToBlog(@Param('blogId', ValidateSerialPipe) blogId: string, @Body() dto: PostToBlogCreateDtoApi) {
        const postId = await this.commandBus.execute(new CreatePostToBlogCommand(blogId, dto));
        return this.postsQueryRepository.getPost(postId);
    }

    @UseGuards(JwtOptionalAuthGuard)
    @Get(':blogId/posts')
    async getPosts(
        @Param('blogId', ValidateSerialPipe) blogId: string,
        @Query() query: GetPostsQueryParams,
        @ExtractAnyUserFromRequest() dto: UserJwtPayloadDto,
    ) {
        const blog = await this.blogsQueryRepository.getBlog(blogId);
        const userId = dto ? dto.userId : null;
        return this.postsQueryRepository.getAllPosts(query, userId, blog.id);
    }

    //TODO 1: Добавить PUT /sa/blogs/{blogId}/posts/{postId}
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(BasicAuthGuard)
    @Put(':blogId/posts/:postId')
    async updatePostToBlog(@Param('blogId', ValidateSerialPipe) blogId: string) {
        return this.commandBus.execute(new DeleteBlogCommand(blogId));
    }

    //TODO 2: Добавить DELETE /sa/blogs/{blogId}/posts/{postId}
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(BasicAuthGuard)
    @Delete(':blogId/posts/:postId')
    async deletePostToBlog(@Param('blogId', ValidateSerialPipe) blogId: string) {
        return this.commandBus.execute(new DeleteBlogCommand(blogId));
    }
}
