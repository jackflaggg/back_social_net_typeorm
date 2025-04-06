import { EmailService } from '../../../src/features/notifications/application/mail.service';

export class EmailServiceMock extends EmailService {
    // Переопределение метода
    async sendEmailRecoveryMessage(email: string, confirmationCode: string): Promise<void | null> {
        console.log('Call mock method sendEmailRecoveryMessage / EmailServiceMock');

        return Promise.resolve(); // или возвращаем объект, если это необходимо
    }
}
