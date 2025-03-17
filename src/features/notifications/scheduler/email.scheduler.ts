import { Injectable } from '@nestjs/common';
import { CronJob } from 'cron';
import { EmailRetryService } from '../application/mail.retry.service';

@Injectable()
export class EmailScheduler {
    constructor(private readonly emailRetryService: EmailRetryService) {
        this.start();
    }
    private start() {
        const job = new CronJob('*/15 * * * *', () => {
            // Каждые 60 минут
            // this.emailRetryService.retryFailedEmail().catch(err => {
            //     console.log('Ошибка в задаче повторной отправки email:', err);
            // });
        });

        job.start();
    }
}
