import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostStatus } from '../../domain/typeorm/posts/post.status.entity';
import { StatusLikeType } from '../../../../../libs/contracts/enums/status/status.like';

@Injectable()
export class StatusPostRepositoryOrm {
    constructor(@InjectRepository(PostStatus) protected postStatusRepository: Repository<PostStatus>) {}
    async getStatusPost(postId: string, userId: string): Promise<any> {
        const result = await this.postStatusRepository.findOne({ where: { postId, userId } });
        if (!result) {
            return void 0;
        }
        return result;
    }
    async createLikeStatusPost(postId: string, userId: string, status: StatusLikeType): Promise<void> {
        const result = PostStatus.buildInstance(status, userId, postId);
        await this.save(result);
    }
    async updateLikeStatusPost(statusPost: PostStatus, userId: string, status: StatusLikeType): Promise<void> {
        statusPost.updateStatus(status);
        await this.save(statusPost);
    }
    private async save(entity: PostStatus) {
        await this.postStatusRepository.save(entity);
    }
}
