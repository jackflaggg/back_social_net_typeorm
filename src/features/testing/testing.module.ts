import { Module } from '@nestjs/common';
import { TestingController } from './api/testing.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogEntity, BlogSchema } from '../bloggers-platform/blogs/domain/blog.entity';
import { PostEntity, PostSchema } from '../bloggers-platform/posts/domain/post.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: BlogEntity.name, schema: BlogSchema },
            { name: PostEntity.name, schema: PostSchema },
        ]),
    ],
    controllers: [TestingController],
})
export class TestingModule {}
