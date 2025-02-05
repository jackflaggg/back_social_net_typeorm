import { Injectable } from '@nestjs/common';
import { PostDocument, PostEntity, PostModelType } from '../domain/post.entity';
import { InjectModel } from '@nestjs/mongoose';
import { DeletionStatus } from 'libs/contracts/enums/deletion-status.enum';
import { NotFoundDomainException } from '../../../../core/exceptions/incubator-exceptions/domain-exceptions';

@Injectable()
export class PostsRepository {
    constructor(@InjectModel(PostEntity.name) private postModel: PostModelType) {}
    async save(post: PostDocument): Promise<void> {
        await post.save();
    }
    async findPostByIdOrFail(id: string) {
        const post = await this.postModel.findOne({ _id: id, deletionStatus: DeletionStatus.enum['not-deleted'] });
        if (!post) {
            throw NotFoundDomainException.create('Post not found');
        }
        return post;
    }
    async updateCountStatusesPost(postId: string, statuses: { likesCount: number; dislikesCount: number }) {
        const updateResult = await this.postModel.updateOne(
            { _id: postId },
            { $set: { 'extendedLikesInfo.likesCount': statuses.likesCount, 'extendedLikesInfo.dislikesCount': statuses.dislikesCount } },
        );
        return updateResult.matchedCount === 1;
    }
}
