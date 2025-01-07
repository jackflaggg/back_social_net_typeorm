import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BlogEntity, BlogModelType } from '../../bloggers-platform/blogs/domain/blog.entity';
import { PostEntity, PostModelType } from '../../bloggers-platform/posts/domain/post.entity';

export class TestingDbRepositories {
    constructor(
        @InjectModel(BlogEntity.name) private BlogModel: BlogModelType,
        @InjectModel(PostEntity.name) private PostModel: PostModelType,
    ) {}
    async delete() {
        const collectionsToDelete = [this.BlogModel.name, this.PostModel.name];
        try {
            for (const collectionsToDeleteElement of collectionsToDelete) {
                await mongoose.connection.collection(collectionsToDeleteElement).deleteMany({});
            }
            return;
        } catch (err: unknown) {
            return;
        }
    }
}
