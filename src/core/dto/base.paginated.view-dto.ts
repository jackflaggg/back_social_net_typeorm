import { BlogViewDto } from '../../features/bloggers-platform/blogs/dto/repository/query/blog-view.dto';
import { PostViewDto } from '../../features/bloggers-platform/posts/dto/repository/post-view';
import { UserViewDto } from '../../features/user-accounts/dto/api/user-view.dto';
import { commentIntInterface } from '../../features/bloggers-platform/comments/utils/comments/mapping/transform.comment.map';

export abstract class PaginatedViewDto<T> {
    abstract items: T;
    totalCount: number;
    pagesCount: number;
    page: number;
    pageSize: number;

    public static mapToView<T>(data: { items: T; page: number; size: number; totalCount: number }): PaginatedViewDto<T> {
        return {
            pagesCount: Math.ceil(data.totalCount / data.size),
            page: Number(data.page),
            pageSize: Number(data.size),
            totalCount: data.totalCount,
            items: data.items,
        };
    }
}

export abstract class PaginatedBlogViewDto extends PaginatedViewDto<BlogViewDto[]> {
    items: BlogViewDto[];
}

export abstract class PaginatedPostViewDto extends PaginatedViewDto<PostViewDto[]> {
    items: PostViewDto[];
}

export abstract class PaginatedUserViewDto extends PaginatedViewDto<UserViewDto[]> {
    items: UserViewDto[];
}

export abstract class PaginatedCommentViewDto extends PaginatedViewDto<commentIntInterface[]> {
    items: commentIntInterface[];
}
