import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../domain/typeorm/user/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { EmailConfirmationToUser } from '../../../domain/typeorm/email-confirmation/email.confirmation.entity';
import {
    NotFoundDomainException,
    UnauthorizedDomainException,
} from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { RecoveryPasswordToUser } from '../../../domain/typeorm/password-recovery/pass-rec.entity';
import { userEmailMapper } from '../../../../../core/utils/user/find.user.by.email.mapper';

@Injectable()
export class UserRepositoryOrm {
    constructor(
        @InjectRepository(User) private userRepositoryTypeOrm: Repository<User>,
        @InjectRepository(EmailConfirmationToUser) private emailConfirmationRepositoryTypeOrm: Repository<EmailConfirmationToUser>,
        @InjectRepository(RecoveryPasswordToUser) private recoveryPasswordRepositoryTypeOrm: Repository<RecoveryPasswordToUser>,
        @InjectEntityManager() private readonly entityManager: EntityManager,
    ) {}
    async save(entity: User) {
        const result = await this.userRepositoryTypeOrm.save(entity);
        return result.id;
    }
    async findUserById(userId: string) {
        const result = await this.userRepositoryTypeOrm
            .createQueryBuilder('u')
            .where('u.id = :userId AND u.deleted_at IS NULL', { userId })
            .getOne();
        if (!result) {
            throw NotFoundDomainException.create('юзер не найден', 'userId');
        }
        return result;
    }
    async findCheckExistUser(login: string, email: string) {
        const result = await this.userRepositoryTypeOrm
            .createQueryBuilder('u')
            .where('u.email = :email OR u.login = :login', { email, login })
            .getOne();
        if (!result) {
            return void 0;
        }
        return result;
    }
    async findUserByLoginOrEmail(loginOrEmail: string) {
        const result = await this.userRepositoryTypeOrm
            .createQueryBuilder('u')
            .select([
                'u.id AS id',
                'u.email AS email',
                'u.password_hash AS password',
                'em.is_confirmed AS isConfirmed',
                'em.confirmation_code AS confirmationCode',
            ])
            .innerJoin('email_confirmation_to_user', 'em', 'u.id = em.user_id')
            .where('(u.login = :loginOrEmail OR u.email = :loginOrEmail)', { loginOrEmail })
            .andWhere('u.deleted_at IS NULL')
            .getRawOne();
        console.log(result);
        if (!result) {
            return void 0;
        }
        return userEmailMapper(result);
    }
    async findUserByEmail(email: string) {
        const result = await this.userRepositoryTypeOrm
            .createQueryBuilder('u')
            .innerJoinAndSelect('email_confirmation_to_user', 'em', 'u.id = em.user_id')
            .where('u.email = :email AND u.deleted_at IS NULL', { email })
            .getOne();
        if (!result) {
            return void 0;
        }
        return result;
    }
    async findUserByEmailRaw(email: string) {
        const result = await this.userRepositoryTypeOrm
            .createQueryBuilder('u')
            .select([
                'u.id AS id',
                'u.email AS email',
                'u.password_hash AS password',
                'em.is_confirmed AS isConfirmed',
                'em.confirmation_code AS confirmationCode',
            ])
            .innerJoin('email_confirmation_to_user', 'em', 'u.id = em.user_id')
            .where('u.email = :email AND u.deleted_at IS NULL', { email })
            .getRawOne();
        if (!result) {
            return void 0;
        }
        return userEmailMapper(result);
    }
    async findUserAuth(userId: string) {
        const result = await this.userRepositoryTypeOrm
            .createQueryBuilder('u')
            .select('u.id AS userId')
            .innerJoin('email_confirmation_to_user', 'em', 'u.id = em.user_id')
            .where('u.id = :userId AND u.deleted_at IS NULL', { userId })
            .getRawOne();
        if (!result) {
            throw UnauthorizedDomainException.create();
        }
        return {
            userId: result.userid,
        };
    }
    async getPasswordUser(userId: string) {
        const result = await this.userRepositoryTypeOrm
            .createQueryBuilder('u')
            .where('u.deleted_at IS NULL AND u.id = :userId', { userId })
            .getOne();
        if (!result) {
            throw NotFoundDomainException.create('юзер не найден', 'userId');
        }
        return result;
    }
    // email-confirmation!
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
            //.select(['em.confirmation_code AS confirmationCode, em.expiration_date AS expirationDate, em.is_confirmed AS isConfirmed'])
            .where('em.confirmation_code = :code', { code })
            .getOne();
        if (!result) {
            return void 0;
        }
        return result;
    }
    async saveEmailConfirmation(entity: EmailConfirmationToUser) {
        const result = await this.emailConfirmationRepositoryTypeOrm.save(entity);
        // TODO: Переделать на функцию маппер!
        return {
            userId: result.userId,
            confirmationCode: result.confirmationCode,
        };
    }

    async saveRecoveryPassword(entity: RecoveryPasswordToUser) {
        await this.recoveryPasswordRepositoryTypeOrm.save(entity);
    }
}
