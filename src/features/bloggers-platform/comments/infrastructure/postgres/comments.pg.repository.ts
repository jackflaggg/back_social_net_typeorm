import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class CommentsPgRepository {
    constructor(@InjectDataSource() protected dataSource: DataSource) {}
    async findCommentById(commentId: string) {}
}
