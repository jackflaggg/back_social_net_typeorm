import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { CommentsQueryRepository } from '../infrastructure/query/comments.query.repository';

@Controller('/comments')
export class CommentController {
    constructor(private readonly commentsQueryRepository: CommentsQueryRepository) {}
    @Get(':id')
    async getComment(@Param('id') id: string) {
        const comment = await this.commentsQueryRepository.getComment(id);
        if (!comment) {
            throw new BadRequestException('Comment not found');
        }
        return comment;
    }
}
