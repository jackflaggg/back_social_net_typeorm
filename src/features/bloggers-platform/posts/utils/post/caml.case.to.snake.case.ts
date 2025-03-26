import { EntitiesSortByEnum, PostSortByValues } from '../../../../../libs/contracts/enums/post/entitiesSortByEnum';

export const convertCamelCaseToSnakeCase = (sortBy: EntitiesSortByEnum) => {
    if (PostSortByValues.includes(sortBy)) {
        return sortBy.replace(/([A-Z])/g, '_\$1').toLowerCase();
    }
    return sortBy.toLowerCase();
};
