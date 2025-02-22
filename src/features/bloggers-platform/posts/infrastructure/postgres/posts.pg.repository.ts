import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostToBlogCreateDtoApi } from '../../../blogs/dto/api/blog.to.post.create.dto';

@Injectable()
export class PostsPgRepository {
    constructor(@InjectDataSource() protected dataSource: DataSource) {}
    async createPost(dto: PostToBlogCreateDtoApi, blogId: string) {
        const query = `INSERT INTO "posts" (title, short_description, content, blog_id) VALUES ($1, $2, $3, $4) RETURNING "id"`;
        return await this.dataSource.query(query, [dto.title, dto.shortDescription, dto.content, +blogId]);
    }
    async findPostById(postId: string) {
        const query = `SELECT "id" FROM "posts" WHERE "id" = $1 AND "deleted_at" IS NOT NULL`;
        const result = await this.dataSource.query(query, [postId]);
        if (!result || result.length === 0) {
            return void 0;
        }
        return result[0];
    }
    async deletePost(postId: string) {
        const deletedPostDate = new Date().toISOString();
        const query = `UPDATE "posts" SET "deleted_at" = $1 WHERE "id" = $1`;
        return await this.dataSource.query(query, [deletedPostDate, postId]);
    }
    async updatePost() {}
}
