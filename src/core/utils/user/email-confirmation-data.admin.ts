import { randomUUID } from 'node:crypto';
import { add } from 'date-fns/add';

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
            expirationDate: add(new Date(), { hours: 1, minutes: 30, seconds: 10 }),
            isConfirmed: false,
        },
    };
}
