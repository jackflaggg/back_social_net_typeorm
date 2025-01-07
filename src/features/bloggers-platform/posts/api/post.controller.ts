import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

@Controller('posts')
export class PostsController {
    constructor(private readonly postService: any /*PostService*/) {}

    @Get()
    async getPosts(@Query() term?: string) {
        return [];
    }

    @Get(':postId')
    async getPost(@Param('postId') blogId: string) {
        return blogId;
    }

    @Post()
    async createPost(@Body() dto: any /*PostCreateDtoToApi*/) {
        return dto;
    }

    @Put(':postId')
    async updatePost(@Param('postId') blogId: string, @Body() dto: any /*PostUpdateDtoToApi*/) {
        return dto;
    }

    @Delete(':postId')
    async deleteBlog(@Param('postId') postId: string) {
        return postId;
    }
}
