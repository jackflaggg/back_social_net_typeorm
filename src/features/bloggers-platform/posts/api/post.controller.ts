import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { PostsQueryRepository } from '../infrastructure/query/posts.query-repository';
import { GetPostsQueryParams } from '../dto/api/get-posts-query-params.input.dto';
import { PostCreateDtoApi } from '../dto/api/post.create.dto';
import { PostUpdateDtoApi } from '../dto/api/post.update.dto';
import { CommentCreateToPostApi } from '../dto/api/comment.create.to.post';
import { CommandBus } from '@nestjs/cqrs';
import { CreatePostCommand } from '../application/usecases/create-post.usecase';
import { UpdatePostCommand } from '../application/usecases/update-post.usecase';
import { DeletePostCommand } from '../application/usecases/delete-post.usecase';

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
    async getPost(@Param('postId') postId: string) {
        const post = await this.postsQueryRepository.getPost(postId);
        if (!post) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        return post;
    }

    @Post()
    async createPost(@Body() dto: PostCreateDtoApi) {
        const postId = await this.commandBus.execute(new CreatePostCommand(dto));
        return await this.postsQueryRepository.getPost(postId);
    }
    @HttpCode(204)
    @Put(':postId')
    async updatePost(@Param('postId') postId: string, @Body() dto: PostUpdateDtoApi) {
        return await this.commandBus.execute(new UpdatePostCommand(postId, dto));
    }
    @HttpCode(204)
    @Delete(':postId')
    async deleteBlog(@Param('postId') postId: string) {
        return await this.commandBus.execute(new DeletePostCommand(postId));
    }

    @Post(':postId/comments')
    async createCommentToPost(@Param('postId') postId: string, @Body() dto: CommentCreateToPostApi) {}

    @Get(':postId/comments')
    async getComments(@Param('postId') postId: string, @Body() dto: CommentCreateToPostApi) {}
}
