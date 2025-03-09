import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../user-accounts/infrastructure/typeorm/user/user.orm.repo';
import { EmailService } from './mail.service';

@Injectable()
export class EmailRetryService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly mailer: EmailService,
    ) {}
    async retryFailedEmail() {
        const users = await this.userRepository.findUsersWithUnsentEmails();
        for (const user of users) {
            try {
                // await this.mailer.sendEmailRecoveryMessage(user.email, user.confirmationCode);
                // Обновляем sentEmail на true после успешной отправки
                // await this.userRepository.update(user.id, { sentEmail: true });
            } catch (err) {
                console.log('Ошибка при повторной отправке email:', err);
            }
        }
    }
}