import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { Blog } from '../../domain/typeorm/blog.entity';
import { BlogCreateRepositoryDto } from '../../application/usecases/create-blog.usecase';
import { BlogUpdateDtoApi } from '../../dto/api/blog.update.dto';

@Injectable()
export class BlogsRepositoryOrm {
    constructor(@InjectRepository(Blog) private blogsRepositoryTypeOrm: Repository<Blog>) {}

    async findBlogById(blogId: string): Promise<Blog> {
        const result = await this.blogsRepositoryTypeOrm
            .createQueryBuilder('b')
            .where('b.deleted_at IS NULL AND b.id = :blogId', { blogId })
            .getOne();
        if (!result) {
            throw NotFoundDomainException.create('блог не найден', 'blogId');
        }
        return result;
    }

    private async save(entity: Blog): Promise<string> {
        const result = await this.blogsRepositoryTypeOrm.save(entity);
        return result.id;
    }
    async createBlog(dto: BlogCreateRepositoryDto): Promise<string> {
        const blogEntity = Blog.buildInstance(dto);
        return this.save(blogEntity);
    }
    async deleteBlog(blog: Blog): Promise<string> {
        blog.makeDeleted();
        return this.save(blog);
    }
    async updateBlog(dto: BlogUpdateDtoApi, blog: Blog): Promise<string> {
        blog.update(dto);
        return this.save(blog);
    }
}
