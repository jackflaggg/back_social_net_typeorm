import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PasswordRecoveryRepositoryOrm {
    constructor(@InjectDataSource() protected dataSource: DataSource) {}
    async findCode(code: string) {
        const query = `
            SELECT "id", "user_id" AS "userId", "used" FROM "recovery_password"
            WHERE "recovery_code" = $1
        `;
        const result = await this.dataSource.query(query, [code]);
        if (!result) {
            return void 0;
        }
        return result;
    }
    async updateStatus(passwordId: string) {
        const query = `
            UPDATE "recovery_password" SET "used" = TRUE
            WHERE "id" = $1
        `;
        await this.dataSource.query(query, [Number(passwordId)]);
    }
    async createPasswordRecovery(userId: string, code: string, expirationDate: Date) {
        const query = `
            INSERT INTO "recovery_password"("user_id", recovery_code, recovery_expiration_date) VALUES($1, $2, $3)
        `;
        const result = await this.dataSource.query(query, [userId, code, expirationDate.toISOString()]);
        if (!result) {
            return void 0;
        }
        return result;
    }
}
