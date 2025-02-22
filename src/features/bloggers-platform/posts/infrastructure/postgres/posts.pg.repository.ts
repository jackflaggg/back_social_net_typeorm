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
    async findPostById(postId: string) {}
    async deletePost(postId: string) {}
    async updatePost() {}
}
