import { Module } from '@nestjs/common';
import { TestingController } from './api/testing.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogEntity, BlogSchema } from '../bloggers-platform/blogs/domain/blog.entity';
import { PostEntity, PostSchema } from '../bloggers-platform/posts/domain/post.entity';
import { CommentEntity, CommentSchema } from '../bloggers-platform/comments/domain/comment.entity';
import { UserEntity, UserSchema } from '../user-accounts/domain/user/user.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: BlogEntity.name, schema: BlogSchema },
            { name: PostEntity.name, schema: PostSchema },
            { name: CommentEntity.name, schema: CommentSchema },
            { name: UserEntity.name, schema: UserSchema },
        ]),
    ],
    controllers: [TestingController],
})
export class TestingModule {}
