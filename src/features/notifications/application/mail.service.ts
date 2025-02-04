import { Injectable } from '@nestjs/common';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { EmailAdapter } from '../adapter/email.adapter';

@Injectable()
export class EmailService {
    constructor(private readonly emailAdapter: EmailAdapter) {}
    async sendEmailRecoveryMessage(email: string, confirmationCode: string): Promise<SMTPTransport.SentMessageInfo | null> {
        return await this.emailAdapter.sendEmail(email, confirmationCode);
    }
    async sendPasswordRecoveryMessage(email: string, confirmationCode: string): Promise<SMTPTransport.SentMessageInfo | null> {
        return await this.emailAdapter.sendPassword(email, confirmationCode);
    }
}
