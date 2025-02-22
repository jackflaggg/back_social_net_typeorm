import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { emailConfirmAdminInterface } from '../../../../../core/utils/user/email-confirmation-data.admin';
import { NotFoundDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';

export interface UserCreateDtoRepo {
    login: string;
    email: string;
    password: string;
    createdAt: Date;
}

@Injectable()
export class UserPgRepository {
    constructor(@InjectDataSource() protected dataSource: DataSource) {}

    async findUserByLoginAndEmail(login: string, email: string) {
        const query = `
            SELECT "id" FROM "users" WHERE "deleted_at" IS NULL AND ("login" = $1 OR "email" = $2);
        `;
        const result = await this.dataSource.query(query, [login, email]);
        if (!result || result.length === 0) {
            throw NotFoundDomainException.create('блог не найден', 'blogId');
        }

        return result[0];
    }
    async findUserByLoginOrEmail(loginOrEmail: string) {
        const query = `
            SELECT u."id", u."email", u."password_hash" AS "password", em."is_confirmed" AS "isConfirmed" FROM "users" AS "u" JOIN "email_confirmation" AS "em" ON u.id = em.user_id WHERE u."deleted_at" IS NULL AND (u."login" = $1 OR u."email" = $1);
        `;
        const result = await this.dataSource.query(query, [loginOrEmail]);
        if (!result || result.length === 0) {
            throw NotFoundDomainException.create('блог не найден', 'blogId');
        }

        return result[0];
    }
    async findUserById(userId: string) {
        const query = `
            SELECT u."id", ec."confirmation_code" AS "confirmationCode" FROM "users" AS "u" 
            JOIN "email_confirmation" AS ec on u.id = ec.user_id
            WHERE u."id" = $1 AND u."deleted_at" IS NULL
        `;
        const result = await this.dataSource.query(query, [userId]);
        if (!result || result.length === 0) {
            throw NotFoundDomainException.create('блог не найден', 'blogId');
        }
        return result[0];
    }

    async createUser(newUser: UserCreateDtoRepo, emailConfirm: emailConfirmAdminInterface) {
        const queryUsers = `
            INSERT INTO "users" ("login", "email", "created_at", "password_hash")
            VALUES ($1, $2, $3, $4)
            RETURNING "id" as "id", login as "login", "email" as "email", "created_at" as "createdAt"
        `;

        const result = await this.dataSource.query(queryUsers, [
            newUser.login,
            newUser.email,
            newUser.createdAt.toISOString(),
            newUser.password,
        ]);

        if (!result || result.length === 0) {
            throw NotFoundDomainException.create('блог не найден', 'blogId');
        }

        const userId = result[0].id;

        const queryEmailConfirmation = `
            INSERT INTO "email_confirmation" ("confirmation_code", "expiration_date", "is_confirmed", "user_id")
            VALUES ($1, $2, $3, $4)`;

        await this.dataSource.query(queryEmailConfirmation, [
            emailConfirm.emailConfirmation.confirmationCode,
            emailConfirm.emailConfirmation.expirationDate.toISOString(),
            emailConfirm.emailConfirmation.isConfirmed,
            userId,
        ]);

        return userId;
    }
    async updateDeletedAt(userId: string) {
        //TODO: Как мне удалять, чтобы секвенсы не путались?
        const query = `
        UPDATE "users" SET "deleted_at" = $1 WHERE id = $2
        `;
        await this.dataSource.query(query, [new Date().toISOString(), userId]);
        //await this.dataSource.query(`ALTER SEQUENCE users_id_seq RESTART WITH ${userId}`);
    }
    deleteAll() {
        this.dataSource.query(`TRUNCATE TABLE users RESTART IDENTITY cascade`);
    }
    async updateUserToCodeAndDate(userId: string, generateCode: string, newExpirationDate: string) {
        const query = `
            UPDATE "email_confirmation"
            SET "confirmation_code" = $1,
                "expiration_date" = $2,
                "is_confirmed" = FALSE
            WHERE "user_id" = $3`;
        return await this.dataSource.query(query, [generateCode, newExpirationDate, userId]);
    }
    async findUserCode(code: string) {
        const query = `
        SELECT u."id" AS "userId", em."is_confirmed" AS "isConfirmed", em.expiration_date AS "expirationDate", em.confirmation_code AS "confirmationCode" 
        FROM "users" AS "u" 
            JOIN "email_confirmation" AS "em" 
                ON u.id = em.user_id 
            WHERE confirmation_code = $1
        `;
        const result = await this.dataSource.query(query, [code]);
        if (!result || result.length === 0) {
            throw NotFoundDomainException.create('блог не найден', 'blogId');
        }
        return result[0];
    }
    async updateUserToEmailConf(userId: string) {
        const query = `
            UPDATE "email_confirmation"
            SET "confirmation_code" = $1,
                "is_confirmed" = TRUE
            WHERE "user_id" = $2`;
        return await this.dataSource.query(query, ['+', userId]);
    }
}
