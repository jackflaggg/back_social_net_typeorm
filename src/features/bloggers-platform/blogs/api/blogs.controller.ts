import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { BlogService } from '../application/blog.service';
import { BlogUpdateDtoApi } from '../dto/api/blog.update.dto';
import { BlogCreateDtoApi } from '../dto/api/blog.create.dto';
import { BlogsQueryRepository } from '../infrastructure/query/blogs.query-repository';
import { GetBlogsQueryParams } from '../dto/repository/query/get-blogs-query-params.input-dto';
import { PostToBlogCreateDtoApi } from '../dto/api/blog.to.post.create.dto';
import { PostToBlogCreateDtoService } from '../dto/service/blog.to.post.create.dto';
import { PostsQueryRepository } from '../../posts/infrastructure/query/posts.query-repository';
import { GetPostsQueryParams } from '../../posts/dto/api/get-posts-query-params.input.dto';
import mongoose from 'mongoose';

@Controller('blogs')
export class BlogsController {
    constructor(
        private readonly blogService: BlogService,
        private readonly blogsQueryRepository: BlogsQueryRepository,
        private readonly postsQueryRepository: PostsQueryRepository,
    ) {}

    @Get()
    async getBlogs(@Query() query: GetBlogsQueryParams) {
        return this.blogsQueryRepository.getAllBlogs(query);
    }

    @Get(':blogId/posts')
    async getPosts(@Param('blogId') blogId: string, @Query() query: GetPostsQueryParams) {
        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            throw new HttpException('Not a valid blogId', HttpStatus.NOT_FOUND);
        }
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
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        return blog;
    }

    @HttpCode(201)
    @Post()
    async createBlog(@Body() dto: BlogCreateDtoApi) {
        const blogId = await this.blogService.createBlog(dto);
        const newBlog = await this.blogsQueryRepository.getBlog(blogId);
        return newBlog;
    }

    @HttpCode(201)
    @Post(':blogId/posts')
    async createPostToBlog(@Param('blogId') blogId: string, @Body() dto: PostToBlogCreateDtoApi) {
        const postDto: PostToBlogCreateDtoService = {
            ...dto,
            blogId, // добавляем blogId в DTO
        };
        const resultId = await this.blogService.createPostToBlog(blogId, postDto);
        return await this.postsQueryRepository.getPost(resultId);
    }

    @HttpCode(204)
    @Put(':blogId')
    async updateBlog(@Param('blogId') blogId: string, @Body() dto: BlogUpdateDtoApi) {
        return await this.blogService.updateBlog(blogId, dto);
    }

    @HttpCode(204)
    @Delete(':blogId')
    async deleteBlog(@Param('blogId') blogId: string) {
        return await this.blogService.deleteBlog(blogId);
    }
}
