export function emailConfirmationData() {
    return {
        emailConfirmation: {
            confirmationCode: '+',
            expirationDate: new Date(),
            isConfirmed: true,
        },
    };
}
