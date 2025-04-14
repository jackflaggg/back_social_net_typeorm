import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../../domain/typeorm/post.entity';
import { NotFoundDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { Blog } from '../../../blogs/domain/typeorm/blog.entity';
import { PostToBlogCreateDtoApi } from '../../../blogs/dto/api/blog.to.post.create.dto';
import { PostUpdateDtoApi } from '../../dto/api/post.update.dto';

@Injectable()
export class PostsRepositoryOrm {
    constructor(@InjectRepository(Post) protected postRepository: Repository<Post>) {}
    private async save(entity: Post): Promise<string> {
        const result: Post = await this.postRepository.save(entity);
        return String(result.id);
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
    async createPost(dto: PostToBlogCreateDtoApi, blog: Blog): Promise<string> {
        const postEntity = Post.buildInstance(dto, blog);
        return this.save(postEntity);
    }
    async deletePost(post: Post): Promise<string> {
        post.markDeleted();
        return this.save(post);
    }
    async updatePost(dto: PostUpdateDtoApi, post: Post): Promise<string> {
        post.update(dto);
        return this.save(post);
    }
}
