import { Type } from 'class-transformer';

export class PaginationParams {
    @Type(() => Number)
    pageNumber: number = 1;

    @Type(() => Number)
    pageSize: number = 10;

    static calculateSkip(instance: PaginationParams): number {
        return (instance.pageNumber - 1) * instance.pageSize;
    }
}

export enum SortDirection {
    Asc = 'ASC',
    Desc = 'DESC',
}

//базовый класс для query параметров с сортировкой и пагинацией
//поле sortBy должно быть реализовано в наследниках
export abstract class BaseSortablePaginationParams<T> extends PaginationParams {
    sortDirection: SortDirection = SortDirection.Desc;
    abstract sortBy: T;
}
