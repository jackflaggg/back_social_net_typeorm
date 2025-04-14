import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { SETTINGS } from '../../../../core/settings';
import { BasicAuthGuard } from '../../../../core/guards/passport/guards/basic.auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { QuestionCreateDto } from '../dto/question-create.dto';
import { QuestionViewDto } from '../dto/question-view.dto';
import { QuestionPublishDto, QuestionUpdateDto } from '../dto/question-update.dto';
import { UpdateQuestionCommand } from '../applications/usecases/update-question.usecase';
import { PublishQuestionCommand } from '../applications/usecases/publish-question.usecase';
import { DeleteQuestionCommand } from '../applications/usecases/delete-question.usecase';
import { CreateQuestionCommand } from '../applications/usecases/create-question.usecase';
import { PaginatedQuestionViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { GetQuestionsQueryParams } from '../dto/get-questions-query-params.input-dto';
import { QuestionsQueryRepository } from '../infrastructure/typeorm/query/questions.query-repository';

@Controller(SETTINGS.PATH.SA_QUESTIONS)
@UseGuards(BasicAuthGuard)
export class QuestionsSaController {
    constructor(
        private readonly questionsQueryRepository: QuestionsQueryRepository,
        private readonly commandBus: CommandBus,
    ) {}

    @Get()
    findQuestions(@Query() query: GetQuestionsQueryParams): Promise<PaginatedQuestionViewDto> {
        const questions = this.questionsQueryRepository.getQuestions(query);
        return questions;
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createQuestion(@Body() body: QuestionCreateDto): Promise<QuestionViewDto> {
        const questionId = await this.commandBus.execute(new CreateQuestionCommand(body));
        const newQuestion = await this.questionsQueryRepository.findQuestionByIdOrNotFoundFail(questionId);

        return newQuestion;
    }

    @Put(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    updateQuestion(@Param('id') id: string, @Body() body: QuestionUpdateDto): Promise<void> {
        return this.commandBus.execute(new UpdateQuestionCommand(id, body));
    }

    @Put(':id/publish')
    @HttpCode(HttpStatus.NO_CONTENT)
    publishQuestion(@Param('id') id: string, @Body() body: QuestionPublishDto): Promise<void> {
        return this.commandBus.execute(new PublishQuestionCommand(id, body));
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteQuestion(@Param('id') id: string): Promise<void> {
        return this.commandBus.execute(new DeleteQuestionCommand(id));
    }
}
