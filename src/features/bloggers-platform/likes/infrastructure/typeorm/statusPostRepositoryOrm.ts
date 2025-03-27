import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParentTypes } from '../../../../../libs/contracts/enums/status/parent.type.likes';
import { Post } from '../../../posts/domain/typeorm/post.entity';
import { PostStatus } from '../../domain/typeorm/posts/post.status.entity';

@Injectable()
export class StatusPostRepositoryOrm {
    constructor(@InjectRepository(PostStatus) protected postStatusRepository: Repository<PostStatus>) {}
    async getStatusPost(postId: string, userId: string): Promise<string | void> {
        const query = `SELECT "status" FROM "likes" WHERE "post_id" = $1 AND "user_id" = $2 AND "parent_type" = $3`;
        const result = await this.postStatusRepository.query(query, [postId, userId, ParentTypes.enum['post']]);
        if (!result) {
            return void 0;
        }
        return result.status;
    }
    async createLikeStatusPost(postId: string, userId: string, status: string): Promise<void> {
        const query = `INSERT INTO "likes" (parent_type, post_id, user_id, status) VALUES ($1, $2, $3, $4) RETURNING "id"`;
        await this.postStatusRepository.query(query, [ParentTypes.enum['post'], postId, userId, status]);
    }
    async updateLikeStatusPost(post: Post, userId: string, status: string): Promise<void> {
        const query = `UPDATE "likes" SET "status" = $1 WHERE "parent_type" = $2 AND "post_id" = $3 AND "user_id" = $4`;
        await this.postStatusRepository.query(query, [status, ParentTypes.enum['post'], post, userId]);
    }
}
