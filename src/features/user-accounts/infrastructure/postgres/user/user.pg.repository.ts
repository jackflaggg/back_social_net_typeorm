import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { emailConfirmAdminInterface } from '../../../../../core/utils/user/email-confirmation-data.admin';

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
            SELECT "id" FROM "users" WHERE "deletedat" IS NULL AND ("login" = $1 OR "email" = $2);
        `;
        const result = await this.dataSource.query(query, [login, email]);
        if (!result || result.length === 0) {
            return void 0;
        }

        return result[0];
    }
    async findUserByLoginOrEmail(loginOrEmail: string) {
        const query = `
            SELECT "id", "passwordhash" AS "password" FROM "users" WHERE "deletedat" IS NULL AND ("login" = $1 OR "email" = $1);
        `;
        const result = await this.dataSource.query(query, [loginOrEmail]);
        if (!result || result.length === 0) {
            return void 0;
        }

        return result[0];
    }
    async findUserById(userId: string) {
        const query = `
            SELECT u."id", ec."confirmationcode" AS "confirmationCode" FROM "users" AS "u" 
            JOIN "email_confirmation" AS ec on u.id = ec.userid
            WHERE u."id" = $1 AND u."deletedat" IS NULL
        `;
        const result = await this.dataSource.query(query, [userId]);
        if (!result || result.length === 0) {
            return void 0;
        }
        return result[0];
    }

    async createUser(newUser: UserCreateDtoRepo, emailConfirm: emailConfirmAdminInterface) {
        const queryUsers = `
            INSERT INTO "users" ("login", "email", "createdat", "passwordhash")
            VALUES ($1, $2, $3, $4)
            RETURNING "id" as "id", login as "login", "email" as "email", "createdat" as "createdAt"
        `;

        const result = await this.dataSource.query(queryUsers, [
            newUser.login,
            newUser.email,
            newUser.createdAt.toISOString(),
            newUser.password,
        ]);

        if (!result || result.length === 0) {
            return void 0;
        }

        const userId = result[0].id;

        const queryEmailConfirmation = `
            INSERT INTO "email_confirmation" ("confirmationcode", "expirationdate", "isconfirmed", "userid")
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
        UPDATE "users" SET "deletedat" = $1 WHERE id = $2
        `;
        await this.dataSource.query(query, [new Date().toISOString(), userId]);
        //await this.dataSource.query(`ALTER SEQUENCE users_id_seq RESTART WITH ${userId}`);
    }
    deleteAll() {
        const tables = ['email_confirmation', 'recovery_password', 'security_device', 'users'];
        tables.map(table => this.dataSource.query(`ALTER SEQUENCE ${table}_id_seq RESTART WITH 1`));
        tables.map(table => this.dataSource.query(`DELETE FROM ${table}`));
    }
}
