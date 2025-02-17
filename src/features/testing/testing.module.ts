import { DynamicModule, Module } from '@nestjs/common';
import { TestingController } from './api/testing.controller';
import { config } from 'dotenv';
config();
import { MongooseModule } from '@nestjs/mongoose';
import { BlogEntity, BlogSchema } from '../bloggers-platform/blogs/domain/blog.entity';
import { PostEntity, PostSchema } from '../bloggers-platform/posts/domain/post.entity';
import { CommentEntity, CommentSchema } from '../bloggers-platform/comments/domain/comment.entity';
import { UserEntity, UserSchema } from '../user-accounts/domain/user/user.entity';
import { DeviceEntity, DeviceSchema } from '../user-accounts/domain/device/device.entity';
import { PasswordRecoveryEntity, PasswordRecoverySchema } from '../user-accounts/domain/password-recovery/password-recovery.entity';
import { StatusEntity, StatusSchema } from '../bloggers-platform/likes/domain/status.entity';
import { NewestLikesEntity, NewestLikesSchema } from '../bloggers-platform/posts/domain/last.three.likes.entity';
import { ExtendedLikesEntity, ExtendedLikesSchema } from '../bloggers-platform/posts/domain/extended.like.entity';

@Module({})
export class TestingModule {
    static register(): DynamicModule {
        if (process.env.NODE_ENV !== 'production') {
            return {
                module: TestingModule,
                controllers: [TestingController],
                imports: [
                    // MongooseModule.forFeature([
                    //     { name: UserEntity.name, schema: UserSchema },
                    //     { name: DeviceEntity.name, schema: DeviceSchema },
                    //     { name: PasswordRecoveryEntity.name, schema: PasswordRecoverySchema },
                    //     { name: BlogEntity.name, schema: BlogSchema },
                    //     { name: PostEntity.name, schema: PostSchema },
                    //     { name: CommentEntity.name, schema: CommentSchema },
                    //     { name: NewestLikesEntity.name, schema: NewestLikesSchema },
                    //     { name: ExtendedLikesEntity.name, schema: ExtendedLikesSchema },
                    //     { name: StatusEntity.name, schema: StatusSchema },
                    // ]),
                ],
                providers: [],
            };
        }
        return {
            module: TestingModule,
            controllers: [],
            providers: [],
        };
    }
}
