import { Module } from '@nestjs/common';
import { BlogsController } from './blogs/api/blogs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogEntity, BlogSchema } from './blogs/domain/blog.entity';
import { BlogsRepository } from './blogs/infrastructure/blogs.repository';
import { BlogsQueryRepository } from './blogs/infrastructure/query/blogs.query-repository';
import { PostsRepository } from './posts/infrastructure/post.repository';
import { PostEntity, PostSchema } from './posts/domain/post.entity';
import { NewestLikesEntity, NewestLikesSchema } from './posts/domain/last.three.likes.entity';
import { ExtendedLikesEntity, ExtendedLikesSchema } from './posts/domain/extended.like.entity';
import { PostsQueryRepository } from './posts/infrastructure/query/posts.query-repository';
import { PostsController } from './posts/api/post.controller';
import { CommentController } from './comments/api/comment.controller';
import { CommentEntity, CommentSchema } from './comments/domain/comment.entity';
import { CommentsQueryRepository } from './comments/infrastructure/query/comments.query.repository';
import { CreateBlogUseCase } from './blogs/application/usecases/create-blog.usecase';
import { DeleteBlogUseCase } from './blogs/application/usecases/delete-blog.usecase';
import { UpdateBlogUseCase } from './blogs/application/usecases/update-blog.usecase';
import { CreatePostToBlogUseCase } from './blogs/application/usecases/create-post-to-blog.usecase';
import { CqrsModule } from '@nestjs/cqrs';
import { CreatePostUseCase } from './posts/application/usecases/create-post.usecase';
import { DeletePostUseCase } from './posts/application/usecases/delete-post.usecase';
import { UpdatePostUseCase } from './posts/application/usecases/update-post.usecase';
import { JwtOptionalAuthGuard } from '../../core/guards/optional/guards/jwt.optional.auth.guards';
import { APP_GUARD } from '@nestjs/core';
import { CreateCommentUseCase } from './comments/application/usecases/create-comment.usecase';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../user-accounts/user-accounts.module';
import { CommentRepository } from './comments/infrastructure/comment.repository';
import { StatusEntity, StatusSchema } from './likes/domain/status,entity';

const repositories = [
    BlogsQueryRepository,
    BlogsRepository,
    CommentsQueryRepository,
    PostsQueryRepository,
    PostsRepository,
    CommentRepository,
];
const useCases = [
    CreateBlogUseCase,
    DeleteBlogUseCase,
    UpdateBlogUseCase,
    CreatePostToBlogUseCase,
    CreateCommentUseCase,
    CreatePostUseCase,
    DeletePostUseCase,
    UpdatePostUseCase,
];

@Module({
    imports: [
        PassportModule,
        MongooseModule.forFeature([
            { name: BlogEntity.name, schema: BlogSchema },
            { name: PostEntity.name, schema: PostSchema },
            { name: CommentEntity.name, schema: CommentSchema },
            { name: NewestLikesEntity.name, schema: NewestLikesSchema },
            { name: ExtendedLikesEntity.name, schema: ExtendedLikesSchema },
            { name: StatusEntity.name, schema: StatusSchema },
        ]),
        CqrsModule,
        UsersModule,
    ],
    controllers: [BlogsController, PostsController, CommentController],
    providers: [
        ...repositories,
        ...useCases,
        {
            provide: APP_GUARD,
            useClass: JwtOptionalAuthGuard,
        },
    ],
})
export class BloggersPlatformModule {}
