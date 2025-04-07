import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { SETTINGS } from '../../../../core/settings';
import { BasicAuthGuard } from '../../../../core/guards/passport/guards/basic.auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { ValidateUUIDPipe } from '../../../../core/pipes/validation.input.uuid';

@Controller(SETTINGS.PATH.PAIR_GAME_QUIZ_PAIRS)
export class PairGameQuizPairsController {
    constructor(private readonly commandBus: CommandBus) {}

    @Get()
    async getQuestions(@Query() query: any) {}

    @HttpCode(HttpStatus.CREATED)
    @Post()
    async createQuestion() {}

    @HttpCode(HttpStatus.NO_CONTENT)
    @Put(':questionId')
    async updateQuestion(@Param('questionId', ValidateUUIDPipe) questionId: string) {}

    @HttpCode(HttpStatus.NO_CONTENT)
    @Put(':questionId/publish')
    async updateQuestionStatusPublish(@Param('questionId', ValidateUUIDPipe) questionId: string) {}

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':questionId')
    async deleteQuestion(@Param('questionId', ValidateUUIDPipe) questionId: string) {}
}
