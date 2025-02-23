import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class StatusPgRepository {
    constructor(@InjectDataSource() protected dataSource: DataSource) {}
    async getStatusComment(commentId: string, userId: string) {
        const query = `SELECT "status" FROM "likes" WHERE "comment_id" = $1 AND "user_id" = $2 AND "parent_type" = $3`;
        const result = await this.dataSource.query(query, [commentId, userId, 'comment']);
        if (!result || result.length === 0) {
            return void 0;
        }
        return result[0].status;
    }
    async getStatusPost(postId: string, userId: string) {
        const query = `SELECT "status" FROM "likes" WHERE "post_id" = $1 AND "user_id" = $2 AND "parent_type" = $3`;
        const result = await this.dataSource.query(query, [postId, userId, 'post']);
        if (!result || result.length === 0) {
            return void 0;
        }
        return result[0].status;
    }
    async createLikeStatusComment(commentId: string, userId: string, status: string) {
        const query = `INSERT INTO "likes" (parent_type, comment_id, status, user_id) VALUES ($1, $2, $3) RETURNING "id"`;
        return await this.dataSource.query(query, ['comment', commentId, userId, status]);
    }
    async createLikeStatusPost(postId: string, userId: string, status: string) {
        const query = `INSERT INTO "likes" (parent_type, comment_id, status, user_id) VALUES ($1, $2, $3) RETURNING "id"`;
        return await this.dataSource.query(query, ['post', postId, userId, status]);
    }
    async updateLikeStatusComment(commentId: string, userId: string, status: string) {
        const query = `UPDATE "likes" SET "status" = $1 WHERE "parent_type" = $2 AND "comment_id" = $3 AND "user_id" = $4`;
        return await this.dataSource.query(query, [status, 'comment', commentId, userId]);
    }
    async updateLikeStatusPost(postId: string, userId: string, status: string) {
        const query = `UPDATE "likes" SET "status" = $1 WHERE "parent_type" = $2 AND "post_id" = $3 AND "user_id" = $4`;
        return await this.dataSource.query(query, [status, 'post', postId, userId]);
    }
}
