import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Put, UseGuards } from '@nestjs/common';
import { CommentsQueryRepository } from '../infrastructure/query/comments.query.repository';
import { JwtAuthGuard } from '../../../../core/guards/passport/guards/jwt.auth.guard';
import { JwtOptionalAuthGuard, Public } from '../../../../core/guards/optional/guards/jwt.optional.auth.guards';
import { CommandBus } from '@nestjs/cqrs';

@Controller('/comments')
export class CommentController {
    constructor(
        private readonly commentsQueryRepository: CommentsQueryRepository,
        private readonly commandBus: CommandBus,
    ) {}
    @UseGuards(JwtOptionalAuthGuard)
    @Public()
    @Get('/:commentId')
    async getComment(@Param('commentId') id: string) {
        return await this.commentsQueryRepository.getComment(id);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JwtAuthGuard)
    @Put('/:commentId')
    async updateComment(@Param('commentId') id: string) {}

    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JwtAuthGuard)
    @Put('/:commentId/like-status')
    async likeComment(@Param('commentId') id: string) {}

    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JwtAuthGuard)
    @Delete('/:commentId')
    async deleteComment(@Param('commentId') id: string) {}
}
