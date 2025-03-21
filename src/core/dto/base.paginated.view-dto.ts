import { BlogViewDto } from '../../features/bloggers-platform/blogs/dto/repository/query/blog-view.dto';

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
