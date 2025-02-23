import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BadRequestDomainException, NotFoundDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';

@Injectable()
export class CommentsPgRepository {
    constructor(@InjectDataSource() protected dataSource: DataSource) {}
    async findCommentById(commentId: string) {
        const query = `SELECT "id", "commentator_id" AS "userId" FROM "comments" WHERE "deleted_at" IS NULL AND "id" = $1`;
        const result = await this.dataSource.query(query, [commentId]);
        if (!result || result.length === 0) {
            throw NotFoundDomainException.create('коммент не найден', 'commentId');
        }
        return result[0];
    }
    async createComment(content: string, postId: string, userId: string) {
        const parentType = 'comment';

        try {
            // Начинаем транзакцию
            await this.dataSource.query('BEGIN');

            // Вставка комментария
            const queryOne = `INSERT INTO "comments" (content, post_id, commentator_id) VALUES ($1, $2, $3) RETURNING "id"`;
            const resultComments = await this.dataSource.query(queryOne, [content, postId, userId]);

            // Вставка статуса
            const queryTwo = `INSERT INTO "likes" (parent_type, comment_id, user_id) VALUES ($1, $2, $3)`;
            await this.dataSource.query(queryTwo, [parentType, resultComments[0].id, userId]);

            // Подтверждаем транзакцию
            await this.dataSource.query('COMMIT');
            return resultComments;
        } catch (err: unknown) {
            // Откатываем транзакцию в случае ошибки
            await this.dataSource.query('ROLLBACK');
            throw BadRequestDomainException.create('упала транзакция в создании комментария!' + err, 'commentId');
        }
    }
    async updateComment(commentId: string, content: string) {
        const query = `
        UPDATE "comments" SET "content" = $1 WHERE "id" = $2`;
        await this.dataSource.query(query, [content, commentId]);
    }
    async deleteComment(dateExpired: string, commentId: string) {
        const query = `
        UPDATE "comments" SET "deleted_at" = $1 WHERE "id" = $2`;
        await this.dataSource.query(query, [dateExpired, commentId]);
    }
}
