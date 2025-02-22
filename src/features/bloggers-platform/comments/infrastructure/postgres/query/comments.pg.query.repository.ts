import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class CommentsPgQueryRepository {
    constructor(@InjectDataSource() protected dataSource: DataSource) {}
    async getComment(commentId: string, userId: string | null) {}
}
