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
import { CoreConfig } from '../../core/config/core.config';
import { BlogsPgQueryRepository } from './blogs/infrastructure/postgres/query/blogs.pg.query.repository';
import { BlogsPgRepository } from './blogs/infrastructure/postgres/blogs.pg.repository';
import { PostsPgRepository } from './posts/infrastructure/postgres/posts.pg.repository';
import { PostsPgQueryRepository } from './posts/infrastructure/postgres/query/posts.pg.query.repository';
import { BlogsSaController } from './blogs/api/blogs.sa.controller';
import { CommentsPgQueryRepository } from './comments/infrastructure/postgres/query/comments.pg.query.repository';
import { UpdatePostToBlogUseCase } from './blogs/application/usecases/update-post-to-blog.usecase';
import { DeletePostToBlogUseCase } from './blogs/application/usecases/delete-post-to-blog.usecase';

const repositoriesPostgres = [
    BlogsPgQueryRepository,
    BlogsPgRepository,
    PostsPgRepository,
    PostsPgQueryRepository,
    CommentsPgQueryRepository,
];
const useCases = [
    CreateBlogUseCase,
    DeleteBlogUseCase,
    UpdateBlogUseCase,
    CreatePostToBlogUseCase,
    // CreateCommentUseCase,
    CreatePostUseCase,
    DeletePostUseCase,
    UpdatePostUseCase,
    UpdatePostToBlogUseCase,
    DeletePostToBlogUseCase,
    // LikePostUseCase,
    // DeleteCommentUseCase,
    // CheckUserCommentUseCase,
    // UpdateStatusCommentUseCase,
    // UpdateContentCommentUseCase,
];

@Module({
    imports: [
        // Вы можете игнорировать expiresIn: '5m' в JwtModule.register(), так как в вашей логике этот параметр переопределяется.
        JwtModule.registerAsync({
            imports: [ConfigModule],
            // Указывает, какие зависимости нужно "внедрить" в фабричную функцию useFactory.
            inject: [CoreConfig],
            // фабричная функция, которая будет возвращать объект конфигурации
            useFactory: async (coreConfig: CoreConfig) => ({
                secret: coreConfig.accessTokenSecret,
                signOptions: { expiresIn: coreConfig.accessTokenExpirationTime },
            }),
        }),
        PassportModule,
        CqrsModule,
        UsersModule,
    ],
    controllers: [BlogsController, BlogsSaController /*, PostsController, CommentController*/],
    providers: [...repositoriesPostgres, ...useCases],
})
export class BloggersPlatformModule {}
