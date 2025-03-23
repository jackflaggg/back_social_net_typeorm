import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetPostsQueryParams } from '../../../dto/api/get-posts-query-params.input.dto';
import { PostViewDto } from '../../../dto/repository/post-view';
import { getPostsQuery } from '../../../utils/post/query.insert.get';
import { Post } from '../../../domain/typeorm/post.entity';
import { NotFoundDomainException } from '../../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { Blog } from '../../../../blogs/domain/typeorm/blog.entity';

@Injectable()
export class PostsQueryRepositoryOrm {
    constructor(@InjectRepository(Post) protected postRepositoryOrm: Repository<Post>) {}
    async getAllPosts(queryData: GetPostsQueryParams, userId: string | null, blogId?: string) {
        const { pageSize, pageNumber, sortBy, sortDirection } = getPostsQuery(queryData);

        const updatedSort = sortBy === 'createdAt' ? 'created_at' : sortBy.toLowerCase();

        const offset = (pageNumber - 1) * pageSize;
        const checkBlogId = blogId ? `AND p.'blog_id' = ${blogId}` : ``;
        const queryBuilderToPosts = await this.postRepositoryOrm
            .createQueryBuilder('p')
            .select([
                'p.id AS id, p.title AS title, p.short_description AS shortDescription, p.content AS content, p.created_at AS createdAt, p.blog_id AS blogId, b.name AS blogName',
            ])
            .leftJoin(Blog, 'b', 'p.blog_id = b.id')
            .where(`p.deleted_at IS NULL ${checkBlogId}`)
            .orderBy(`p.${updatedSort}`, sortDirection)
            .skip(offset)
            .take(pageSize)
            .getRawMany();
        return queryBuilderToPosts;
    }

    async getPost(postId: string, userId: string | null) {
        const result = await this.postRepositoryOrm
            .createQueryBuilder('p')
            .select([
                'p.id AS id, p.title AS title, p.short_description AS shortDescription, p.content AS content, p.created_at AS createdAt, p.blog_id AS blogId, b.name AS blogName',
            ])
            .leftJoin(Blog, 'b', 'b.id = p.blog_id')
            .where('p.deleted_at IS NULL AND p.id = :postId', { postId })
            .getRawOne();
        if (!result) {
            throw NotFoundDomainException.create('пост не найден', 'postId');
        }
        return PostViewDto.mapToView(result);
    }
}
