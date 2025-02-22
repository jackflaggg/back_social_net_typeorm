import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { GetBlogsQueryParams } from '../dto/repository/query/get-blogs-query-params.input-dto';
import { GetPostsQueryParams } from '../../posts/dto/api/get-posts-query-params.input.dto';
import { CommandBus } from '@nestjs/cqrs';
import { ExtractAnyUserFromRequest } from '../../../../core/decorators/param/validate.user.decorators';
import { UserJwtPayloadDto } from '../../../user-accounts/strategies/refresh.strategy';
import { JwtOptionalAuthGuard } from '../../../../core/guards/optional/jwt-optional-auth.guard';
import { SETTINGS } from '../../../../core/settings';
import { BlogsPgQueryRepository } from '../infrastructure/postgres/query/blogs.pg.query.repository';
import { PostsPgQueryRepository } from '../../posts/infrastructure/postgres/query/posts.pg.query.repository';
import { ValidateSerialPipe } from '../../../../core/pipes/validation.input.serial';

@Controller(SETTINGS.PATH.BLOGS)
export class BlogsController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly blogsQueryRepository: BlogsPgQueryRepository,
        private readonly postsQueryRepository: PostsPgQueryRepository,
    ) {}

    // мне нужно, чтоб этот роут был чисто по blogs , а остальные по /sa/blogs
    @Get()
    async getBlogs(@Query() query: GetBlogsQueryParams) {
        return this.blogsQueryRepository.getAllBlogs(query);
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

    @Get(':blogId')
    async getBlog(@Param('blogId', ValidateSerialPipe) blogId: string) {
        return this.blogsQueryRepository.getBlog(blogId);
    }
}
