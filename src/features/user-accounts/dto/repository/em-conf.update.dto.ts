export type EmailConfirmationUpdateDto = {
    confirmationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
};
