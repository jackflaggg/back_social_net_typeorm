import { BlogViewDto } from '../../features/bloggers-platform/blogs/dto/api/blog-view.dto';

export abstract class PaginatedViewDto<T> {
    abstract items: T;
    totalCount: number;
    pagesCount: number;
    page: number;
    pageSize: number;

    //статический метод-утилита для мапинга
    public static mapToView<T>(data: { items: T; page: number; size: number; totalCount: number }): PaginatedViewDto<T> {
        return {
            totalCount: data.totalCount,
            pagesCount: Math.ceil(data.totalCount / data.size),
            page: data.page,
            pageSize: data.size,
            items: data.items,
        };
    }
}

export abstract class PaginatedBlogViewDto extends PaginatedViewDto<BlogViewDto[]> {
    items: BlogViewDto[];
}
