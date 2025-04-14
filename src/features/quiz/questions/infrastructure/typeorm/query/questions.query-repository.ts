import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from '../../../domain/question.entity';
import { Repository } from 'typeorm';
import { PaginationParams } from '../../../../../../core/dto/base.query-params.input-dto';
import { PaginatedPostViewDto } from '../../../../../../core/dto/base.paginated.view-dto';
import { PublishedStatus } from '../../../dto/questions-publishedStatus';
import { QuestionViewDto } from '../../../dto/question-view.dto';
import { GetQuestionsQueryParams } from '../../../dto/get-questions-query-params.input-dto';
import { NotFoundDomainException } from '../../../../../../core/exceptions/incubator-exceptions/domain-exceptions';

@Injectable()
export class QuestionsQueryRepository {
    constructor(@InjectRepository(Question) protected questionRepo: Repository<Question>) {}
    async getQuestions(queryData: GetQuestionsQueryParams) {
        const { pageSize, pageNumber, sortBy, sortDirection, bodySearchTerm, publishedStatus } = queryData;

        const queryBuilder = this.questionRepo.createQueryBuilder('question').where('question.deletedAt IS NULL');

        if (bodySearchTerm) {
            queryBuilder.andWhere('question.body ILIKE :bodySearchTerm', { bodySearchTerm: `%${bodySearchTerm}%` });
        }
        if (publishedStatus === PublishedStatus.Published) {
            queryBuilder.andWhere('question.published = :published', { published: true });
        }
        if (publishedStatus === PublishedStatus.NotPublished) {
            queryBuilder.andWhere('question.published = :published', { published: false });
        }

        const questions = await queryBuilder
            .orderBy(`question.${sortBy}`, sortDirection.toUpperCase() as 'ASC' | 'DESC')
            .skip(PaginationParams.calculateSkip({ pageNumber, pageSize }))
            .take(pageSize)
            .getMany();

        const questionsCount = await queryBuilder.getCount();

        const questionsView = questions.map(question => QuestionViewDto.mapToView(question));

        return PaginatedPostViewDto.mapToView({
            items: questionsView,
            page: pageNumber,
            size: pageSize,
            totalCount: questionsCount,
        });
    }
    async findQuestionByIdOrNotFoundFail(questionId: string): Promise<QuestionViewDto> {
        const question = await this.questionRepo
            .createQueryBuilder('question')
            .where('question.id = :id', { id: Number(questionId) })
            .andWhere('question.deletedAt IS NULL')
            .getOne();

        if (!question) {
            throw NotFoundDomainException.create('Question not found');
        }

        return QuestionViewDto.mapToView(question);
    }
}
