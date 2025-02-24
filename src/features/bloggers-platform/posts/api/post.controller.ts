import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { PostsPgQueryRepository } from '../infrastructure/postgres/query/posts.pg.query.repository';
import { CommentsPgQueryRepository } from '../../comments/infrastructure/postgres/query/comments.pg.query.repository';
import { SETTINGS } from '../../../../core/settings';
import { JwtOptionalAuthGuard } from '../../../../core/guards/optional/jwt-optional-auth.guard';
import { GetPostsQueryParams } from '../dto/api/get-posts-query-params.input.dto';
import { BasicAuthGuard } from '../../../../core/guards/passport/guards/basic.auth.guard';
import { PostCreateDtoApi } from '../dto/api/post.create.dto';
import { CreatePostCommand } from '../application/usecases/create-post.usecase';
import { PostUpdateDtoApi } from '../dto/api/post.update.dto';
import { UpdatePostCommand } from '../application/usecases/update-post.usecase';
import { DeletePostCommand } from '../application/usecases/delete-post.usecase';
import { JwtAuthGuard } from '../../../../core/guards/passport/guards/jwt.auth.guard';
import { CommentCreateToPostApi } from '../dto/api/comment.create.to.post';
import { ExtractAnyUserFromRequest, ExtractUserFromRequest } from '../../../../core/decorators/param/validate.user.decorators';
import { UserJwtPayloadDto } from '../../../user-accounts/strategies/refresh.strategy';
import { CreateCommentCommand } from '../../comments/application/usecases/create-comment.usecase';
import { PostLikeStatusApi } from '../dto/api/like-status.dto';
import { LikePostCommand } from '../application/usecases/like-post.usecase';
import { GetCommentsQueryParams } from '../../comments/dto/repository/query/query-parans-comments';
import { ValidateSerialPipe } from '../../../../core/pipes/validation.input.serial';

@Controller(SETTINGS.PATH.POSTS)
export class PostsController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly postsQueryRepository: PostsPgQueryRepository,
        private readonly commentQueryRepository: CommentsPgQueryRepository,
    ) {}

    @UseGuards(JwtOptionalAuthGuard)
    @Get()
    async getPosts(
        @Query() query: GetPostsQueryParams,
        @Param('blogId', ValidateSerialPipe) blogId: string,
        @ExtractAnyUserFromRequest() dtoUser: UserJwtPayloadDto,
    ) {
        const userId = dtoUser ? dtoUser.userId : null;
        return await this.postsQueryRepository.getAllPosts(query, blogId, userId);
    }

    @UseGuards(JwtOptionalAuthGuard)
    @Get(':postId')
    async getPost(@Param('postId', ValidateSerialPipe) postId: string, @ExtractAnyUserFromRequest() dtoUser: UserJwtPayloadDto) {
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
    async updatePost(@Param('postId', ValidateSerialPipe) postId: string, @Body() dto: PostUpdateDtoApi) {
        return this.commandBus.execute(new UpdatePostCommand(postId, dto));
    }
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(BasicAuthGuard)
    @Delete(':postId')
    async deletePost(@Param('postId', ValidateSerialPipe) postId: string) {
        return this.commandBus.execute(new DeletePostCommand(postId));
    }

    @UseGuards(JwtAuthGuard)
    @Post(':postId/comments')
    async createCommentToPost(
        @Param('postId', ValidateSerialPipe) id: string,
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
        @Param('postId', ValidateSerialPipe) postId: string,
        @Body() dto: PostLikeStatusApi,
        @ExtractUserFromRequest() dtoUser: UserJwtPayloadDto,
    ) {
        await this.postsQueryRepository.getPost(postId, dtoUser.userId);
        return this.commandBus.execute(new LikePostCommand(dto.likeStatus, postId, dtoUser.userId));
    }

    @UseGuards(JwtOptionalAuthGuard)
    @Get(':postId/comments')
    async getComments(
        @Param('postId', ValidateSerialPipe) postId: string,
        @Query() query: GetCommentsQueryParams,
        @ExtractAnyUserFromRequest() dtoUser: UserJwtPayloadDto | null,
    ) {
        const userId = dtoUser ? dtoUser.userId : null;
        const post = await this.postsQueryRepository.getPost(postId);
        return this.commentQueryRepository.getAllComments(post.id, query, userId);
    }
}
