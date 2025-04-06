import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { emailTemplates } from '../../../templates/email.templates';
import nodemailer, { SentMessageInfo } from 'nodemailer';
import { AppConfig } from '../../../core/config/app.config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailAdapter {
    constructor(private readonly coreConfig: AppConfig) {}
    async sendEmail(emailFrom: string, messageCode: string): Promise<void | null> {
        try {
            const transporter = nodemailer.createTransport({
                service: 'yandex',
                auth: {
                    user: this.coreConfig.adminEmail,
                    pass: this.coreConfig.adminEmailPassword,
                },
                secure: true,
            });

            await transporter.sendMail({
                from: `"Incubator" <${this.coreConfig.adminEmail}>`,
                to: emailFrom,
                subject: 'hello world!',
                html: emailTemplates.registrationEmailTemplate(messageCode),
            });
        } catch (err: unknown) {
            console.log('ошибка при отправке сообщения: ' + String(err));
            return null;
        }
    }

    async sendPassword(emailFrom: string, messageCode: string): Promise<void | null> {
        try {
            const transporter = nodemailer.createTransport({
                service: 'yandex',
                auth: {
                    user: this.coreConfig.adminEmail,
                    pass: this.coreConfig.adminEmailPassword,
                },
                secure: true,
            });

            await transporter.sendMail({
                from: `"Incubator" <${this.coreConfig.adminEmail}>`,
                to: emailFrom,
                subject: 'hello world!',
                html: emailTemplates.recoveryPasswordTemplate(messageCode),
            });
        } catch (err: unknown) {
            console.log('ошибка при отправке сообщения: ' + String(err));
            return null;
        }
    }
}
