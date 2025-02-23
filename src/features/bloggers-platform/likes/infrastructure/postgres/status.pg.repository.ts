import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class StatusPgRepository {
    constructor(@InjectDataSource() protected dataSource: DataSource) {}
    async getStatus(commentId: string, userId: string) {}
    async updateLikeStatus(commentId: string, userId: string, status: string) {}
}
