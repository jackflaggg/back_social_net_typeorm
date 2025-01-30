import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BlogEntity, BlogModelType } from '../../bloggers-platform/blogs/domain/blog.entity';
import { PostEntity, PostModelType } from '../../bloggers-platform/posts/domain/post.entity';
import { HydratedDocument } from 'mongoose';
import { UserEntity, UserModelType } from '../../user-accounts/domain/user/user.entity';
import { CommentEntity, CommentModelType } from '../../bloggers-platform/comments/domain/comment.entity';
import { DeviceEntity, DeviceModelType } from '../../user-accounts/domain/device/device.entity';
import { PasswordRecoveryEntity, PasswordRecoveryModelType } from '../../user-accounts/domain/password-recovery/password-recovery.entity';
import { StatusEntity, StatusModelType } from '../../bloggers-platform/likes/domain/status,entity';

@Controller('testing')
export class TestingController {
    constructor(
        @InjectModel(BlogEntity.name) private readonly BlogModel: BlogModelType,
        @InjectModel(PostEntity.name) private readonly PostModel: PostModelType,
        @InjectModel(UserEntity.name) private readonly UserModel: UserModelType,
        @InjectModel(CommentEntity.name) private readonly CommentModel: CommentModelType,
        @InjectModel(DeviceEntity.name) private readonly DeviceModel: DeviceModelType,
        @InjectModel(PasswordRecoveryEntity.name) private readonly PasswordRecoveryModel: PasswordRecoveryModelType,
        @InjectModel(StatusEntity.name) private readonly StatusModel: StatusModelType,
    ) {}

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('all-data')
    async deleteAll() {
        const collectionsToDelete = [
            this.BlogModel,
            this.PostModel,
            this.UserModel,
            this.CommentModel,
            this.DeviceModel,
            this.PasswordRecoveryModel,
            this.StatusModel,
        ];
        try {
            for (const collectionsToDeleteElement of collectionsToDelete) {
                await (collectionsToDeleteElement as HydratedDocument<any>).deleteMany({});
            }
            return;
        } catch (err: unknown) {
            return err;
        }
    }
}
