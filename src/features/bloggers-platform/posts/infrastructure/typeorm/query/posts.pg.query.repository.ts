import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { GetPostsQueryParams } from '../../../dto/api/get-posts-query-params.input.dto';
import { postOutInterface, PostViewDto } from '../../../dto/repository/post-view';
import { getPostsQuery } from '../../../utils/post/query.insert.get';
import { Post } from '../../../domain/typeorm/post.entity';
import { NotFoundDomainException } from '../../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { Blog } from '../../../../blogs/domain/typeorm/blog.entity';
import { PaginatedPostViewDto, PaginatedViewDto } from '../../../../../../core/dto/base.paginated.view-dto';
import { convertCamelCaseToSnakeCase } from '../../../utils/post/caml.case.to.snake.case';
import { PaginationParams } from '../../../../../../core/dto/base.query-params.input-dto';

@Injectable()
export class PostsQueryRepositoryOrm {
    constructor(@InjectRepository(Post) protected postRepositoryOrm: Repository<Post>) {}

    async getAllPosts(
        queryData: GetPostsQueryParams,
        userId: string | null,
        blogId?: string,
    ) /*: Promise<PaginatedViewDto<PostViewDto[]>>*/ {
        const { pageSize, pageNumber, sortBy, sortDirection } = getPostsQuery(queryData);

        console.log('Page Size:', pageSize);
        console.log('Page Number:', pageNumber);

        const countPosts = await this.postRepositoryOrm.countBy({ deletedAt: IsNull() });
        console.log('Count Posts:', countPosts);
        const offset = PaginationParams.calculateSkip({ pageNumber, pageSize });
        console.log('Offset:', offset);
        const updatedSortBy = sortBy === 'blogName' ? `"${sortBy}"` : `p."${convertCamelCaseToSnakeCase(sortBy)}"`;

        const checkBlogId = blogId ? `AND p.blog_id = :blogId` : '';

        const resultPosts = await this.postRepositoryOrm
            .createQueryBuilder('p')
            // .select([
            //     'p.id AS id, p.title AS title, p.short_description AS "shortDescription", p.content AS content, p.created_at AS "createdAt", p.blog_id AS "blogId", b.name AS "blogName"',
            // ])
            //.leftJoin(Blog, 'b', 'b.id = p.blog_id')
            .where(`p.deleted_at IS NULL`)
            /* 
${checkBlogId}`, { blogId })
 */
            .orderBy(updatedSortBy, sortDirection)
            .skip(offset)
            .take(pageSize)
            .getMany();
        console.log('Result Posts:', resultPosts.length);
        // const postsView: postOutInterface[] = resultPosts.map(post => PostViewDto.mapToView(post));
        //
        // return PaginatedPostViewDto.mapToView<PostViewDto[]>({
        //     items: postsView,
        //     page: pageNumber,
        //     size: pageSize,
        //     totalCount: countPosts,
        // });
    }

    async getPost(postId: string, userId: string | null) {
        const result = await this.postRepositoryOrm
            .createQueryBuilder('p')
            .select([
                'p.id AS id, p.title AS title, p.short_description AS "shortDescription", p.content AS content, p.created_at AS "createdAt", p.blog_id AS "blogId", b.name AS "blogName"',
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
