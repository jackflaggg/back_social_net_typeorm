import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../../domain/typeorm/post.entity';
import { NotFoundDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';

@Injectable()
export class PostsRepositoryOrm {
    constructor(@InjectRepository(Post) protected postRepository: Repository<Post>) {}
    async save(entity: Post): Promise<string> {
        const result = await this.postRepository.save(entity);
        return result.id.toString();
    }
    async findPostById(postId: string): Promise<Post> {
        const result = await this.postRepository
            .createQueryBuilder('p')
            .where('p.deleted_at IS NULL AND p.id = :postId', { postId })
            .getOne();
        if (!result) {
            throw NotFoundDomainException.create('пост не найден', 'postId');
        }
        return result;
    }
}
