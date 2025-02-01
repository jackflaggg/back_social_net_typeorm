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
import { CreateCommentUseCase } from './comments/application/usecases/create-comment.usecase';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../user-accounts/user-accounts.module';
import { CommentRepository } from './comments/infrastructure/comment.repository';
import { StatusEntity, StatusSchema } from './likes/domain/status,entity';
import { JwtModule } from '@nestjs/jwt';
import { StatusRepository } from './posts/infrastructure/status.repository';
import { LikePostUseCase } from './posts/application/usecases/like-post.usecase';
import { DeleteCommentUseCase } from './comments/application/usecases/delete-comment.usecase';
import { CheckUserCommentUseCase } from './comments/application/usecases/check-user-comment.usecase';
import { UpdateStatusCommentUseCase } from './comments/application/usecases/like-comment.usecase';
import { UpdateContentCommentUseCase } from './comments/application/usecases/update-comment.usecase';

const repositories = [
    BlogsQueryRepository,
    BlogsRepository,
    CommentsQueryRepository,
    PostsQueryRepository,
    PostsRepository,
    CommentRepository,
    StatusRepository,
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
    LikePostUseCase,
    DeleteCommentUseCase,
    CheckUserCommentUseCase,
    UpdateStatusCommentUseCase,
    UpdateContentCommentUseCase,
];

@Module({
    imports: [
        // Вы можете игнорировать expiresIn: '5m' в JwtModule.register(), так как в вашей логике этот параметр переопределяется.
        JwtModule.register({
            secret: 'envelope',
            signOptions: { expiresIn: '5m' },
        }),
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
    providers: [...repositories, ...useCases],
})
export class BloggersPlatformModule {}
