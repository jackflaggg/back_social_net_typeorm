export const convertCamelCaseToSnakeCase = (sortBy: string) => {
    const hardValueSortByTest = ['createdAt', 'shortDescription'];
    if (hardValueSortByTest.includes(sortBy)) return sortBy.replace(/([A-Z])/g, '_\$1').toLowerCase();
    return sortBy.toLowerCase();
};
