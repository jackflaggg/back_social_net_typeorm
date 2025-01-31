import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NotFoundDomainException } from '../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { StatusDocument, StatusEntity, StatusModelType } from '../../likes/domain/status,entity';

@Injectable()
export class StatusRepository {
    constructor(@InjectModel(StatusEntity.name) private statusModel: StatusModelType) {}
    async save(status: StatusDocument): Promise<void> {
        await status.save();
    }
    async getStatusPost(postId: string, userId: string) {
        const result = await this.statusModel.findOne({ postId, userId });
        if (!result) {
            throw NotFoundDomainException.create('статус не найден', 'status');
        }
        return result.status;
    }
    async updateLikeStatus(postId: string, userId: string, status: string) {
        const updateResult = await this.statusModel.updateOne({ userId, parentId: postId }, { status });
        return updateResult.matchedCount === 1;
    }
}
