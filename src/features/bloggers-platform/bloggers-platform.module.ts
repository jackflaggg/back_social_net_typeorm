import { Module } from '@nestjs/common';
import { BlogsController } from './blogs/api/blogs.controller';
import { BlogService } from './blogs/application/blog.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogEntity, BlogSchema } from './blogs/domain/blog.entity';
import { BlogsRepository } from './blogs/infrastructure/blogs.repository';
import { BlogsQueryRepository } from './blogs/infrastructure/query/blogs.query-repository';
import { PostsRepository } from './posts/infrastructure/post.repository';
import { PostEntity, PostSchema } from './posts/domain/post.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: BlogEntity.name, schema: BlogSchema },
            { name: PostEntity.name, schema: PostSchema },
        ]),
    ],
    controllers: [BlogsController],
    providers: [BlogService, BlogsQueryRepository, BlogsRepository, PostsRepository],
})
export class BloggersPlatformModule {}
