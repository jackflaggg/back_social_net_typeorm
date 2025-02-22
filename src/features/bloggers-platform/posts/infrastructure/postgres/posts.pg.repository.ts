import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostToBlogCreateDtoApi } from '../../../blogs/dto/api/blog.to.post.create.dto';

@Injectable()
export class PostsPgRepository {
    constructor(@InjectDataSource() protected dataSource: DataSource) {}
    async createPost(dto: PostToBlogCreateDtoApi, blogId: string, blogName: string) {}
    async findPostById(postId: string) {}
    async deletePost(postId: string) {}
    async updatePost() {}
}
