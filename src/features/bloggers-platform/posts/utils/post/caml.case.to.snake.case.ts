import { PostSortByEnum, PostSortByValues } from '../../../../../libs/contracts/enums/post/post.sort.by.enum';

export const convertCamelCaseToSnakeCase = (sortBy: PostSortByEnum) => {
    if (PostSortByValues.includes(sortBy)) {
        return sortBy.replace(/([A-Z])/g, '_\$1').toLowerCase();
    }
    return sortBy.toLowerCase();
};
