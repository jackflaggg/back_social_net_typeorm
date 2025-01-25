import { InjectModel } from '@nestjs/mongoose';
import { BlogDocument, BlogEntity, BlogModelType } from '../domain/blog.entity';
import { DeletionStatus } from '@libs/contracts/enums/deletion-status.enum';
import { Injectable } from '@nestjs/common';
import { NotFoundDomainException } from '../../../../core/exceptions/incubator-exceptions/domain-exceptions';

@Injectable()
export class BlogsRepository {
    constructor(@InjectModel(BlogEntity.name) private readonly blogModel: BlogModelType) {}

    async save(blog: BlogDocument): Promise<void> {
        await blog.save();
    }

    async findBlogByIdOrFail(id: string): Promise<BlogDocument> {
        const result = await this.blogModel.findOne({ _id: id, deletionStatus: DeletionStatus.enum['not-deleted'] });
        if (!result) {
            throw NotFoundDomainException.create('Blog not found');
            //return void 0;
        }
        return result;
    }
}
