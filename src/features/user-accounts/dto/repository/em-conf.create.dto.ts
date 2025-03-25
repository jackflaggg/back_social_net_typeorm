export interface emailConfirmationCreateDto {
    confirmationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
}
