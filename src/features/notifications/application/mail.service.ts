import { Injectable } from '@nestjs/common';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { emailAdapter } from '../adapter/email.adapter';

@Injectable()
export class EmailService {
    static async sendEmailRecoveryMessage(email: string, confirmationCode: string): Promise<SMTPTransport.SentMessageInfo | null> {
        return await emailAdapter.sendEmail(email, confirmationCode);
    }
    static async sendPasswordRecoveryMessage(email: string, confirmationCode: string): Promise<SMTPTransport.SentMessageInfo | null> {
        return await emailAdapter.sendPassword(email, confirmationCode);
    }
}
