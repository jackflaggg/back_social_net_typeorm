import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { emailTemplates } from '../../../templates/email.templates';
import nodemailer from 'nodemailer';

export const emailAdapter = {
    async sendEmail(emailFrom: string, messageCode: string): Promise<SMTPTransport.SentMessageInfo | null> {
        try {
            const transporter = nodemailer.createTransport({
                service: 'Mail.ru',
                auth: {
                    user: 'SETTINGS.EMAIL_NAME',
                    pass: '',
                },
                tls: {
                    rejectUnauthorized: false,
                },
            });

            return await transporter.sendMail({
                from: `"Incubator" <>`,
                to: emailFrom,
                subject: 'hello world!',
                html: emailTemplates.registrationEmailTemplate(messageCode),
            });
        } catch (err: unknown) {
            console.log('ошибка при отправке сообщения: ' + String(err));
            return null;
        }
    },

    async sendPassword(emailFrom: string, messageCode: string): Promise<SMTPTransport.SentMessageInfo | null> {
        try {
            const transporter = nodemailer.createTransport({
                service: 'Mail.ru',
                auth: {
                    user: '',
                    pass: '',
                },
                tls: {
                    rejectUnauthorized: false,
                },
            });

            return await transporter.sendMail({
                from: `"Incubator" <>`,
                to: emailFrom,
                subject: 'hello world!',
                html: emailTemplates.recoveryPasswordTemplate(messageCode),
            });
        } catch (err: unknown) {
            console.log('ошибка при отправке сообщения: ' + String(err));
            return null;
        }
    },
};
