import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { StatusDocument, StatusEntity, StatusModelType } from '../../../likes/domain/status.entity';

@Injectable()
export class StatusRepository {
    constructor(@InjectModel(StatusEntity.name) private statusModel: StatusModelType) {}
    async save(status: StatusDocument): Promise<void> {
        await status.save();
    }
    async getStatusPost(postId: string, userId: string) {
        const result = await this.statusModel.findOne({ parentId: postId, userId });
        if (!result) {
            return void 0;
        }
        return result.status;
    }
    async updateLikeStatus(postId: string, userId: string, status: string) {
        const updateResult = await this.statusModel.updateOne({ userId, parentId: postId }, { status });
        return updateResult.matchedCount === 1;
    }

    async getStatus(commentId: string, userId: string) {
        const filter = {
            $and: [{ parentId: commentId }, { userId }],
        };
        const result = await this.statusModel.findOne(filter);

        if (!result) {
            return void 0;
        }
        return result.status;
    }
}
