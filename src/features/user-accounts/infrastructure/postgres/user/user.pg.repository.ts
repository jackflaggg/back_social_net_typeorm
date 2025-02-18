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

    async findUserByLoginOrEmail(login: string, email: string) {
        const query = `
            SELECT "id" FROM "users" WHERE "deletedat" IS NULL AND ("login" = $1 OR "email" = $2);
        `;
        const result = await this.dataSource.query(query, [login, email]);
        if (!result || result.length === 0) {
            return void 0;
        }

        return result[0];
    }
    async findUserById(userId: string): Promise<string | void> {
        const query = `
            SELECT * FROM "users" WHERE "id" = $1 AND "deletedat" IS NULL
        `;
        const result = await this.dataSource.query(query, [userId]);
        if (!result || result.length === 0) {
            return void 0;
        }

        return result[0].id;
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
        const query = `
        UPDATE "users" SET "deletedat" = $1 WHERE id = $2
        `;
        await this.dataSource.query(query, [new Date().toISOString(), userId]);
    }
    deleteAll() {
        const tables = ['email_confirmation', 'recovery_password', 'users'];
        tables.map(table => this.dataSource.query(`DELETE FROM ${table}`));
    }
}
