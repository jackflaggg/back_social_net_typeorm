import { Controller, Delete, HttpCode } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BlogEntity, BlogModelType } from '../../bloggers-platform/blogs/domain/blog.entity';
import { PostEntity, PostModelType } from '../../bloggers-platform/posts/domain/post.entity';
import { HydratedDocument } from 'mongoose';
import { UserEntity, UserModelType } from '../../user-accounts/domain/user/user.entity';
import { CommentEntity, CommentModelType } from '../../bloggers-platform/comments/domain/comment.entity';

@Controller('testing')
export class TestingController {
    constructor(
        @InjectModel(BlogEntity.name) private readonly BlogModel: BlogModelType,
        @InjectModel(PostEntity.name) private readonly PostModel: PostModelType,
        @InjectModel(UserEntity.name) private readonly UserModel: UserModelType,
        @InjectModel(CommentEntity.name) private readonly CommentModel: CommentModelType,
    ) {}

    @HttpCode(204)
    @Delete('all-data')
    async deleteAll() {
        const collectionsToDelete = [this.BlogModel, this.PostModel, this.UserModel, this.CommentModel];
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
