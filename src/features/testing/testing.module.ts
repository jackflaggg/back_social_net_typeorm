import { Module } from '@nestjs/common';
import { TestingController } from './api/testing.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogEntity, BlogSchema } from '../bloggers-platform/blogs/domain/blog.entity';
import { PostEntity, PostSchema } from '../bloggers-platform/posts/domain/post.entity';
import { CommentEntity, CommentSchema } from '../bloggers-platform/comments/domain/comment.entity';
import { UserEntity, UserSchema } from '../user-accounts/domain/user/user.entity';
import { DeviceEntity, DeviceSchema } from '../user-accounts/domain/device/device.entity';
import { PasswordRecoveryEntity, PasswordRecoverySchema } from '../user-accounts/domain/password-recovery/password-recovery.entity';
import { StatusEntity, StatusSchema } from '../bloggers-platform/likes/domain/status,entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: BlogEntity.name, schema: BlogSchema },
            { name: PostEntity.name, schema: PostSchema },
            { name: CommentEntity.name, schema: CommentSchema },
            { name: UserEntity.name, schema: UserSchema },
            { name: DeviceEntity.name, schema: DeviceSchema },
            { name: PasswordRecoveryEntity.name, schema: PasswordRecoverySchema },
            { name: StatusEntity.name, schema: StatusSchema },
        ]),
    ],
    controllers: [TestingController],
})
export class TestingModule {}
