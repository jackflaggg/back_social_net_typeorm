import { randomUUID } from 'node:crypto';
import { add } from 'date-fns/add';

export interface emailConfirmAdminInterface {
    confirmationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
}

export interface emailConfirmationData {
    confirmationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
}

export function emailConfirmationDataAdmin(): emailConfirmAdminInterface {
    return {
        confirmationCode: '+',
        expirationDate: new Date(),
        isConfirmed: true,
    };
}

export function emailConfirmationData(): emailConfirmationData {
    const code: string = randomUUID();
    return {
        confirmationCode: code,
        expirationDate: add(new Date(), { hours: 1, minutes: 30, seconds: 10 }),
        isConfirmed: false,
    };
}
