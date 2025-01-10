import { InjectModel } from '@nestjs/mongoose';
import { BlogDocument, BlogEntity, BlogModelType } from '../domain/blog.entity';
import { DeletionStatus } from '@libs/contracts/enums/deletion-status.enum';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';

@Injectable()
export class BlogsRepository {
    constructor(@InjectModel(BlogEntity.name) private readonly blogModel: BlogModelType) {}

    async save(blog: BlogDocument): Promise<void> {
        await blog.save();
    }

    async findBlogById(id: string): Promise<BlogDocument | void> {
        const result = await this.blogModel.findOne({ _id: id, deletionStatus: DeletionStatus.enum['not-deleted'] });
        if (!result) {
            return void 0;
        }
        return result;
    }
}
