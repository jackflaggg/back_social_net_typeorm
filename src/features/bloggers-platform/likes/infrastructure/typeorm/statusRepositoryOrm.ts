import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ParentTypes } from '../../../../../libs/contracts/enums/status/parent.type.likes';

@Injectable()
export class StatusRepositoryOrm {
    constructor(@InjectDataSource() protected dataSource: DataSource) {}
    async getStatusComment(commentId: string, userId: string): Promise<string | void> {
        const query = `SELECT "status" FROM "likes" WHERE "comment_id" = $1 AND "user_id" = $2 AND "parent_type" = $3`;
        const result = await this.dataSource.query(query, [commentId, userId, ParentTypes.enum['comment']]);
        if (!result || result.length === 0) {
            return void 0;
        }
        return result[0].status;
    }
    async getStatusPost(postId: string, userId: string): Promise<string | void> {
        const query = `SELECT "status" FROM "likes" WHERE "post_id" = $1 AND "user_id" = $2 AND "parent_type" = $3`;
        const result = await this.dataSource.query(query, [postId, userId, ParentTypes.enum['post']]);
        if (!result || result.length === 0) {
            return void 0;
        }
        return result[0].status;
    }
    async createLikeStatusComment(commentId: string, userId: string, status: string): Promise<void> {
        const query = `INSERT INTO "likes" (parent_type, comment_id, user_id, status) VALUES ($1, $2, $3, $4) RETURNING "id"`;
        await this.dataSource.query(query, [ParentTypes.enum['comment'], commentId, userId, status]);
    }
    async createLikeStatusPost(postId: string, userId: string, status: string): Promise<void> {
        const query = `INSERT INTO "likes" (parent_type, post_id, user_id, status) VALUES ($1, $2, $3, $4) RETURNING "id"`;
        await this.dataSource.query(query, [ParentTypes.enum['post'], postId, userId, status]);
    }
    async updateLikeStatusComment(commentId: string, userId: string, status: string): Promise<void> {
        const query = `UPDATE "likes" SET "status" = $1 WHERE "parent_type" = $2 AND "comment_id" = $3 AND "user_id" = $4`;
        await this.dataSource.query(query, [status, ParentTypes.enum['comment'], commentId, userId]);
    }
    async updateLikeStatusPost(postId: string, userId: string, status: string): Promise<void> {
        const query = `UPDATE "likes" SET "status" = $1 WHERE "parent_type" = $2 AND "post_id" = $3 AND "user_id" = $4`;
        await this.dataSource.query(query, [status, ParentTypes.enum['post'], postId, userId]);
    }
}
