export const configValidationUtility = {
    convertToBoolean(value: string) {
        const trimmedValue = value?.trim();
        if (trimmedValue === 'true' || trimmedValue === '1' || trimmedValue === 'enabled') return true;
        if (trimmedValue === 'false' || trimmedValue === '0' || trimmedValue === 'disabled') return false;
        return null;
    },
};
