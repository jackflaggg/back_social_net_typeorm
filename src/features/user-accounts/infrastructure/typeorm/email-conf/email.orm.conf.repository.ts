import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailConfirmationToUser } from '../../../domain/typeorm/email-confirmation/email.confirmation.entity';
import { emailConfirmationCreateDto } from '../../../dto/repository/em-conf.create.dto';

@Injectable()
export class EmailConfirmationRepositoryOrm {
    constructor(
        @InjectRepository(EmailConfirmationToUser) private emailConfirmationRepositoryTypeOrm: Repository<EmailConfirmationToUser>,
    ) {}
    async createEmailConfirmationToUser(dto: emailConfirmationCreateDto, userId: string) {
        const result = EmailConfirmationToUser.buildInstance(dto, userId);
        return this.saveEmailConfirmation(result);
    }
    async findEmailConfirmation(userId: string) {
        const result = await this.emailConfirmationRepositoryTypeOrm
            .createQueryBuilder('em')
            .where('em.user_id = :userId', { userId })
            .getOne();
        if (!result) {
            return void 0;
        }
        return result;
    }
    async findCodeToEmailRegistration(code: string) {
        const result = await this.emailConfirmationRepositoryTypeOrm
            .createQueryBuilder('em')
            .where('em.confirmation_code = :code', { code })
            .getOne();
        if (!result) {
            return void 0;
        }
        return result;
    }
    private async saveEmailConfirmation(entity: EmailConfirmationToUser) {
        const result = await this.emailConfirmationRepositoryTypeOrm.save(entity);
        return {
            userId: result.userId,
            confirmationCode: result.confirmationCode,
        };
    }
}
