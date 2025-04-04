import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BlogCreateRepositoryDto } from '../../application/usecases/create-blog.usecase';
import { NotFoundDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';

@Injectable()
export class BlogsPgRepository {
    constructor(@InjectDataSource() protected dataSource: DataSource) {}

    async findBlogById(blogId: string): Promise<string> {
        const query = `SELECT "id", "name"
                       FROM "blogs"
                       WHERE id = $1
                         AND "deleted_at" IS NULL`;
        const result = await this.dataSource.query(query, [blogId]);
        if (!result || result.length === 0) {
            throw NotFoundDomainException.create('блог не найден', 'blogId');
        }
        return result[0].id.toString();
    }

    async deleteBlog(blogId: string): Promise<void> {
        const dateDelete = new Date().toISOString();
        const query = `UPDATE "blogs"
                       SET "deleted_at" = $1
                       WHERE "id" = $2
                       RETURNING "id"`;
        await this.dataSource.query(query, [dateDelete, blogId]);
    }

    async updateBlog(blogId: string, name: string, description: string, websiteUrl: string): Promise<void> {
        const query = `UPDATE "blogs"
                       SET "name"        = $1,
                           "description" = $2,
                           "website_url" = $3
                       WHERE "id" = $4
                       RETURNING "id"`;
        await this.dataSource.query(query, [name, description, websiteUrl, blogId]);
    }

    async createBlog(dto: BlogCreateRepositoryDto): Promise<string> {
        const query = `INSERT INTO "blogs" (name, description, website_url, created_at)
                       VALUES ($1, $2, $3, $4)
                       RETURNING "id"`;
        const result = await this.dataSource.query(query, [dto.name, dto.description, dto.websiteUrl, dto.createdAt]);
        if (!result || result.length === 0) {
            throw NotFoundDomainException.create('блог не найден', 'blogId');
        }

        return result[0].id.toString();
    }
}
