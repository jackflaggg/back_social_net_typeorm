import { Injectable } from '@nestjs/common';
import { PostDocument, PostEntity, PostModelType } from '../domain/post.entity';
import { InjectModel } from '@nestjs/mongoose';
import { DeletionStatus } from '@libs/contracts/enums/deletion-status.enum';

@Injectable()
export class PostsRepository {
    constructor(@InjectModel(PostEntity.name) private postModel: PostModelType) {}
    async save(post: PostDocument): Promise<void> {
        await post.save();
    }
    async findPostById(id: string) {
        const post = await this.postModel.findOne({ _id: id, deletionStatus: DeletionStatus.enum['not-deleted'] });
        if (!post) {
            return void 0;
        }
        return post;
    }
}
