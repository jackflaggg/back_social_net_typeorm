import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../domain/typeorm/user/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { EmailConfirmation } from '../../../domain/typeorm/email-confirmation/email.confirmation.entity';

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(User) private userRepositoryTypeOrm: Repository<User>,
        @InjectRepository(EmailConfirmation) private emailConfirmationRepositoryTypeOrm: Repository<EmailConfirmation>,
        @InjectEntityManager() private readonly entityManager: EntityManager,
    ) {}
    async save(entity: User) {
        await this.userRepositoryTypeOrm.save(entity);
    }
}
