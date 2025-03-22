import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { Blog } from '../../domain/typeorm/blog.entity';

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

    async save(entity: Blog): Promise<string> {
        const result = await this.blogsRepositoryTypeOrm.save(entity);
        return result.id;
    }
}
