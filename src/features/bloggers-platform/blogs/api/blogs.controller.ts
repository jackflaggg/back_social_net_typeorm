import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query } from '@nestjs/common';
import { BlogService } from '../application/blog.service';
import { BlogUpdateDtoApi } from '../dto/api/blog.update.dto';
import { BlogCreateDtoApi } from '../dto/api/blog.create.dto';
import { BlogsQueryRepository } from '../infrastructure/query/blogs.query-repository';
import { GetBlogsQueryParams } from '../dto/api/get-blogs-query-params.input-dto';
import { PostToBlogCreateDtoToApi } from '../dto/api/post.to.blog.create.dto';
import { PostToBlogCreateDtoApi } from '../dto/api/blog.to.post.create.dto';

@Controller('blogs')
export class BlogsController {
    constructor(
        private readonly blogService: BlogService,
        private readonly blogsQueryRepository: BlogsQueryRepository,
    ) {}

    @Get()
    async getBlogs(@Query() query: GetBlogsQueryParams) {
        return this.blogsQueryRepository.getAllBlogs(query);
    }

    @Get(':blogId')
    async getBlog(@Param('blogId') blogId: string) {
        const blog = this.blogsQueryRepository.getBlog(blogId);
        if (!blog) {
            throw new NotFoundException('Blog not found');
        }
        return blog;
    }

    @Post()
    async createBlog(@Body() dto: BlogCreateDtoApi) {
        const blogId = await this.blogService.createBlog(dto);
        const newBlog = await this.blogsQueryRepository.getBlog(blogId);
        return newBlog;
    }

    @Post(':blogId/posts')
    async createPostToBlog(@Param('blogId') blogId: string, @Body() dto: PostToBlogCreateDtoApi) {
        const result = await this.blogService.createPostToBlog(blogId, dto);
        return result;
    }
    @Put(':blogId')
    async updateBlog(@Param('blogId') blogId: string, @Body() dto: BlogUpdateDtoApi) {
        return await this.blogService.updateBlog(blogId, dto);
    }

    @Delete(':blogId')
    async deleteBlog(@Param('blogId') blogId: string) {
        return await this.blogService.deleteBlog(blogId);
    }
}
