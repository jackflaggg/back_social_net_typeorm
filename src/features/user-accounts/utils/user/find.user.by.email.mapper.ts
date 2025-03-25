export const userEmailMapper = (dto: any) => {
    return {
        id: dto.id,
        email: dto.email,
        password: dto.password,
        isConfirmed: dto.isConfirmed,
        confirmationCode: dto.confirmationCode,
    };
};
