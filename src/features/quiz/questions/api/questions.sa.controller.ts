import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { SETTINGS } from '../../../../core/settings';
import { BasicAuthGuard } from '../../../../core/guards/passport/guards/basic.auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { ValidateUUIDPipe } from '../../../../core/pipes/validation.input.uuid';
import { QuestionCreateDtoApi } from '../dto/api/create.question.dto';
import { GetQuestionsQueryParams } from '../dto/api/get-questions-query-params.dto';
import { QuestionsQueryRepositoryOrm } from '../infrastructure/typeorm/query/questions.query-repository';

@Controller(SETTINGS.PATH.SA_QUESTIONS)
@UseGuards(BasicAuthGuard)
export class QuestionsSaController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly questionRepo: QuestionsQueryRepositoryOrm,
    ) {}

    @Get()
    async getQuestions(@Query() query: GetQuestionsQueryParams) {
        return this.questionRepo.getQuestions(query);
    }

    @HttpCode(HttpStatus.CREATED)
    @Post()
    async createQuestion(@Body() questionDto: QuestionCreateDtoApi) {}

    @HttpCode(HttpStatus.NO_CONTENT)
    @Put(':questionId')
    async updateQuestion(@Param('questionId', ValidateUUIDPipe) questionId: string, @Body() questionUpdateDto: any) {}

    @HttpCode(HttpStatus.NO_CONTENT)
    @Put(':questionId/publish')
    async updateQuestionStatusPublish(@Param('questionId', ValidateUUIDPipe) questionId: string, @Body() publishedDto: any) {}

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':questionId')
    async deleteQuestion(@Param('questionId', ValidateUUIDPipe) questionId: string) {}
}
