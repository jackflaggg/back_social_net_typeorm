import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { PostsQueryRepository } from '../infrastructure/query/posts.query-repository';
import { GetPostsQueryParams } from '../dto/api/get-posts-query-params.input.dto';
import { PostCreateDtoApi } from '../dto/api/post.create.dto';
import { PostUpdateDtoApi } from '../dto/api/post.update.dto';
import { CommentCreateToPostApi } from '../dto/api/comment.create.to.post';
import { CommandBus } from '@nestjs/cqrs';
import { CreatePostCommand } from '../application/usecases/create-post.usecase';
import { UpdatePostCommand } from '../application/usecases/update-post.usecase';
import { DeletePostCommand } from '../application/usecases/delete-post.usecase';
import { BasicAuthGuard } from '../../../../core/guards/passport/guards/basic.auth.guard';
import { ValidateObjectIdPipe } from '../../../../core/pipes/validation.input.data.pipe';
import { JwtAuthGuard } from '../../../../core/guards/passport/guards/jwt.auth.guard';

@Controller('posts')
export class PostsController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly postsQueryRepository: PostsQueryRepository,
    ) {}

    @Get()
    async getPosts(@Query() query: GetPostsQueryParams) {
        return await this.postsQueryRepository.getAllPosts(query);
    }

    @Get(':postId')
    async getPost(@Param('postId', ValidateObjectIdPipe) postId: string) {
        return this.postsQueryRepository.getPost(postId);
    }
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(BasicAuthGuard)
    @Post()
    async createPost(@Body() dto: PostCreateDtoApi) {
        const postId = await this.commandBus.execute(new CreatePostCommand(dto));
        return this.postsQueryRepository.getPost(postId);
    }
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(BasicAuthGuard)
    @Put(':postId')
    async updatePost(@Param('postId', ValidateObjectIdPipe) postId: string, @Body() dto: PostUpdateDtoApi) {
        return await this.commandBus.execute(new UpdatePostCommand(postId, dto));
    }
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(BasicAuthGuard)
    @Delete(':postId')
    async deleteBlog(@Param('postId', ValidateObjectIdPipe) postId: string) {
        return await this.commandBus.execute(new DeletePostCommand(postId));
    }

    @UseGuards(JwtAuthGuard)
    @Post(':postId/comments')
    async createCommentToPost(@Param('postId', ValidateObjectIdPipe) postId: string, @Body() dto: CommentCreateToPostApi) {}

    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JwtAuthGuard)
    @Put(':postId/like-status')
    async likePost(@Param('postId', ValidateObjectIdPipe) postId: string, @Body() dto: CommentCreateToPostApi) {}

    @Get(':postId/comments')
    async getComments(@Param('postId', ValidateObjectIdPipe) postId: string, @Body() dto: CommentCreateToPostApi) {}
}
