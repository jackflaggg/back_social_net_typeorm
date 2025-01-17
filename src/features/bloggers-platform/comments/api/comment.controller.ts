import { BadRequestException, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { CommentsQueryRepository } from '../infrastructure/query/comments.query.repository';

@Controller('/comments')
export class CommentController {
    constructor(private readonly commentsQueryRepository: CommentsQueryRepository) {}
    @Get('/:commentId')
    async getComment(@Param('commentId') id: string) {
        const comment = await this.commentsQueryRepository.getComment(id);
        if (!comment) {
            throw new BadRequestException('Comment not found');
        }
        return comment;
    }
    @Put('/:commentId')
    async updateComment(@Param('commentId') id: string) {}

    @Put('/:commentId')
    async likeComment(@Param('commentId') id: string) {}

    @Delete('/:commentId/like-status')
    async deleteComment(@Param('commentId') id: string) {}
}
