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
import { userEmailMapper } from '../../../utils/user/find.user.by.email.mapper';
import { UserCreateDtoRepo } from '../../../dto/repository/user.create.dto';
import { emailConfirmationCreateDto } from '../../../dto/repository/em-conf.create.dto';

@Injectable()
export class UserRepositoryOrm {
    constructor(
        @InjectRepository(User) private userRepositoryTypeOrm: Repository<User>,
        @InjectRepository(EmailConfirmationToUser) private emailConfirmationRepositoryTypeOrm: Repository<EmailConfirmationToUser>,
    ) {}
    private async saveUser(entity: User): Promise<string> {
        const result = await this.userRepositoryTypeOrm.save(entity);
        return result.id;
    }
    async deleteUser(user: User) {
        user.markDeleted();
        return await this.saveUser(user);
    }
    async createUser(dto: UserCreateDtoRepo) {
        const newUser = User.buildInstance(dto);
        return await this.saveUser(newUser);
    }

    async updateUserPassword(entity: User, password: string) {
        entity.updatePassword(password);
        return this.saveUser(entity);
    }

    async findUserById(userId: string): Promise<User> {
        const result = await this.userRepositoryTypeOrm
            .createQueryBuilder('u')
            .where('u.id = :userId AND u.deleted_at IS NULL', { userId })
            .getOne();
        if (!result) {
            throw NotFoundDomainException.create('юзер не найден', 'userId');
        }
        return result;
    }
    async findCheckExistUser(login: string, email: string): Promise<User | void> {
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
                'em.is_confirmed AS "isConfirmed"',
                'em.confirmation_code AS "confirmationCode"',
            ])
            .innerJoin('email_confirmation_to_user', 'em', 'u.id = em.user_id')
            .where('(u.login = :loginOrEmail OR u.email = :loginOrEmail)', { loginOrEmail })
            .andWhere('u.deleted_at IS NULL')
            .getRawOne();
        if (!result) {
            return void 0;
        }
        return userEmailMapper(result);
    }
    async findUserByEmail(email: string): Promise<User | void> {
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
                'em.is_confirmed AS "isConfirmed"',
                'em.confirmation_code AS "confirmationCode"',
            ])
            .innerJoin(EmailConfirmationToUser, 'em', 'u.id = em.user_id')
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
            .select('u.id AS "userId"')
            .innerJoin('email_confirmation_to_user', 'em', 'u.id = em.user_id')
            .where('u.id = :userId AND u.deleted_at IS NULL', { userId })
            .getRawOne();
        if (!result) {
            throw UnauthorizedDomainException.create();
        }
        return {
            userId: result.userId,
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
    async updateUserConfirmedSendEmail(entity: User) {
        entity.confirmedSendEmailRegistration();
        return this.saveUser(entity);
    }
}
