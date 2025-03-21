import { Module } from '@nestjs/common';
import { BlogsController } from './blogs/api/blogs.controller';
import { CreateBlogUseCase } from './blogs/application/usecases/create-blog.usecase';
import { DeleteBlogUseCase } from './blogs/application/usecases/delete-blog.usecase';
import { UpdateBlogUseCase } from './blogs/application/usecases/update-blog.usecase';
import { CreatePostToBlogUseCase } from './blogs/application/usecases/create-post-to-blog.usecase';
import { CqrsModule } from '@nestjs/cqrs';
import { CreatePostUseCase } from './posts/application/usecases/create-post.usecase';
import { DeletePostUseCase } from './posts/application/usecases/delete-post.usecase';
import { UpdatePostUseCase } from './posts/application/usecases/update-post.usecase';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../user-accounts/user-accounts.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AppConfig } from '../../core/config/app.config';
import { BlogsSaController } from './blogs/api/blogs.sa.controller';
import { UpdatePostToBlogUseCase } from './blogs/application/usecases/update-post-to-blog.usecase';
import { DeletePostToBlogUseCase } from './blogs/application/usecases/delete-post-to-blog.usecase';
import { PostsController } from './posts/api/post.controller';
import { CommentController } from './comments/api/comment.controller';
import { CreateCommentUseCase } from './comments/application/usecases/create-comment.usecase';
import { LikePostUseCase } from './posts/application/usecases/like-post.usecase';
import { DeleteCommentUseCase } from './comments/application/usecases/delete-comment.usecase';
import { CheckUserCommentUseCase } from './comments/application/usecases/check-user-comment.usecase';
import { UpdateStatusCommentUseCase } from './comments/application/usecases/like-comment.usecase';
import { UpdateContentCommentUseCase } from './comments/application/usecases/update-comment.usecase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './blogs/domain/typeorm/blog.entity';
import { Post } from './posts/domain/typeorm/post.entity';
import { BlogsRepositoryOrm } from './blogs/infrastructure/typeorm/blogs.pg.repository';
import { BlogsQueryRepositoryOrm } from './blogs/infrastructure/typeorm/query/blogs.pg.query.repository';
import { PostsRepositoryOrm } from './posts/infrastructure/typeorm/posts.pg.repository';
import { PostsQueryRepositoryOrm } from './posts/infrastructure/typeorm/query/posts.pg.query.repository';
import { CommentsOrmQueryRepository } from './comments/infrastructure/typeorm/query/comments.orm.query.repository';
import { CommentsRepositoryOrm } from './comments/infrastructure/typeorm/commentsRepositoryOrm';
import { StatusRepositoryOrm } from './likes/infrastructure/typeorm/statusRepositoryOrm';
import { CommentToUser } from './comments/domain/typeorm/comment.entity';

const repositories = [
    BlogsRepositoryOrm,
    BlogsQueryRepositoryOrm,
    PostsRepositoryOrm,
    PostsQueryRepositoryOrm,
    CommentsOrmQueryRepository,
    CommentsRepositoryOrm,
    StatusRepositoryOrm,
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
    UpdatePostToBlogUseCase,
    DeletePostToBlogUseCase,
    LikePostUseCase,
    DeleteCommentUseCase,
    CheckUserCommentUseCase,
    UpdateStatusCommentUseCase,
    UpdateContentCommentUseCase,
];

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            // Указывает, какие зависимости нужно "внедрить" в фабричную функцию useFactory.
            inject: [AppConfig],
            // фабричная функция, которая будет возвращать объект конфигурации
            useFactory: async (coreConfig: AppConfig) => ({
                secret: coreConfig.accessTokenSecret,
                signOptions: { expiresIn: coreConfig.accessTokenExpirationTime },
            }),
        }),
        TypeOrmModule.forFeature([Blog, Post, CommentToUser]),
        PassportModule,
        CqrsModule,
        UsersModule,
    ],
    controllers: [BlogsController, BlogsSaController, PostsController, CommentController],
    providers: [...repositories, ...useCases],
})
export class BloggersPlatformModule {}
