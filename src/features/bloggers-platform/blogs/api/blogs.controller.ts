import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpException,
    HttpStatus,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
} from '@nestjs/common';
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

    @Get(':blogId/posts')
    async getPosts(@Param('blogId') blogId: string, @Query() query: GetPostsQueryParams) {
        const blog = await this.blogsQueryRepository.getBlog(blogId);
        if (!blog) {
            throw new HttpException('Not blog', HttpStatus.NOT_FOUND);
        }
        return this.postsQueryRepository.getAllPosts(query, blog.id);
    }

    @Get(':blogId')
    async getBlog(@Param('blogId') blogId: string) {
        const blog = await this.blogsQueryRepository.getBlog(blogId);
        if (!blog) {
            throw new NotFoundException('Not found blog');
        }
        return blog;
    }

    @HttpCode(201)
    @Post()
    async createBlog(@Body() dto: BlogCreateDtoApi) {
        const blogId = await this.commandBus.execute(new CreateBlogCommand(dto));
        return await this.blogsQueryRepository.getBlog(blogId);
    }

    @HttpCode(201)
    @Post(':blogId/posts')
    async createPostToBlog(@Param('blogId') blogId: string, @Body() dto: PostToBlogCreateDtoApi) {
        const postId = await this.commandBus.execute(new CreatePostToBlogCommand(blogId, dto));
        return await this.postsQueryRepository.getPost(postId);
    }

    @HttpCode(204)
    @Put(':blogId')
    async updateBlog(@Param('blogId') blogId: string, @Body() dto: BlogUpdateDtoApi) {
        return await this.commandBus.execute(new UpdateBlogCommand(blogId, dto));
    }

    @HttpCode(204)
    @Delete(':blogId')
    async deleteBlog(@Param('blogId') blogId: string) {
        return await this.commandBus.execute(new DeleteBlogCommand(blogId));
    }
}
