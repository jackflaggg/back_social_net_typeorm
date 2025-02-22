import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PasswordRecoveryPgRepository {
    constructor(@InjectDataSource() protected dataSource: DataSource) {}
    async findCode(code: string) {
        const query = `
            SELECT "id", "user_id" AS "userId", "used" FROM "recovery_password"
            WHERE "recovery_code" = $1
        `;
        const result = await this.dataSource.query(query, [code]);
        if (!result || result.length === 0) {
            return void 0;
        }
        return result[0];
    }
    async updateStatus(passwordId: string) {
        const query = `
            UPDATE "recovery_password" SET "used" = TRUE
            WHERE "id" = $1
        `;
        return await this.dataSource.query(query, [+passwordId]);
    }
    async createPasswordRecovery(userId: string, code: string, expirationDate: Date) {
        const query = `
            INSERT INTO "recovery_password"("user_id", recovery_code, recovery_expiration_date) VALUES($1, $2, $3)
        `;
        const result = await this.dataSource.query(query, [userId, code, expirationDate.toISOString()]);
        if (!result || result.length === 0) {
            return void 0;
        }
        return result[0];
    }
}
