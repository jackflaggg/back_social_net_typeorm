import { randomUUID } from 'node:crypto';

export function emailConfirmationDataAdmin() {
    return {
        emailConfirmation: {
            confirmationCode: '+',
            expirationDate: new Date(),
            isConfirmed: true,
        },
    };
}

export function emailConfirmationData() {
    const code = randomUUID();
    return {
        emailConfirmation: {
            confirmationCode: code,
            expirationDate: new Date(),
            isConfirmed: false,
        },
    };
}
