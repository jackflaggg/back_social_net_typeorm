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
import { ExtractAnyUserFromRequest, ExtractUserFromRequest } from '../../../../core/decorators/param/validate.user.decorators';
import { UserJwtPayloadDto } from '../../../../core/guards/passport/strategies/refresh.strategy';
import { CreateCommentCommand } from '../../comments/application/usecases/create-comment.usecase';
import { CommentsQueryRepository } from '../../comments/infrastructure/query/comments.query.repository';
import { GetCommentsQueryParams } from '../../comments/dto/repository/query/query-parans-comments';
import { PostLikeStatusApi } from '../dto/api/like-status.dto';
import { LikePostCommand } from '../application/usecases/like-post.usecase';
import { JwtOptionalAuthGuard } from '../../../../core/guards/optional/jwt-optional-auth.guard';

@Controller('posts')
export class PostsController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly postsQueryRepository: PostsQueryRepository,
        private readonly commentQueryRepository: CommentsQueryRepository,
    ) {}

    @UseGuards(JwtOptionalAuthGuard)
    @Get()
    async getPosts(@Query() query: GetPostsQueryParams, @ExtractAnyUserFromRequest() dtoUser: UserJwtPayloadDto | null) {
        const userId = dtoUser ? dtoUser.userId : null;
        return await this.postsQueryRepository.getAllPosts(query, userId);
    }

    @UseGuards(JwtOptionalAuthGuard)
    @Get(':postId')
    async getPost(@Param('postId', ValidateObjectIdPipe) postId: string, @ExtractAnyUserFromRequest() dtoUser: UserJwtPayloadDto | null) {
        const userId = dtoUser ? dtoUser.userId : null;
        return this.postsQueryRepository.getPost(postId, userId);
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
        return this.commandBus.execute(new UpdatePostCommand(postId, dto));
    }
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(BasicAuthGuard)
    @Delete(':postId')
    async deleteBlog(@Param('postId', ValidateObjectIdPipe) postId: string) {
        return this.commandBus.execute(new DeletePostCommand(postId));
    }

    @UseGuards(JwtAuthGuard)
    @Post(':postId/comments')
    async createCommentToPost(
        @Param('postId', ValidateObjectIdPipe) id: string,
        @Body() dto: CommentCreateToPostApi,
        @ExtractUserFromRequest() dtoUser: UserJwtPayloadDto,
    ) {
        const commentId = await this.commandBus.execute(new CreateCommentCommand(dto, id, dtoUser.userId));
        return this.commentQueryRepository.getComment(commentId, dtoUser.userId);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JwtAuthGuard)
    @Put(':postId/like-status')
    async likePost(
        @Param('postId', ValidateObjectIdPipe) postId: string,
        @Body() dto: PostLikeStatusApi,
        @ExtractUserFromRequest() dtoUser: UserJwtPayloadDto,
    ) {
        return this.commandBus.execute(new LikePostCommand(dto.likeStatus, postId, dtoUser));
    }

    @UseGuards(JwtOptionalAuthGuard)
    @Get(':postId/comments')
    async getComments(
        @Param('postId', ValidateObjectIdPipe) postId: string,
        @Query() query: GetCommentsQueryParams,
        @ExtractAnyUserFromRequest() dtoUser: UserJwtPayloadDto,
    ) {
        const userId = dtoUser ? dtoUser.userId : null;
        const post = await this.postsQueryRepository.getPost(postId);
        return this.commentQueryRepository.getAllComments(post.id, query, userId);
    }
}
