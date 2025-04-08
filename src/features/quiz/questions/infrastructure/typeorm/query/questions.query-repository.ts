import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from '../../../domain/question.entity';
import { Repository } from 'typeorm';
import { GetQuestionsQueryParams } from '../../../dto/api/get-questions-query-params.dto';

@Injectable()
export class QuestionsQueryRepositoryOrm {
    constructor(@InjectRepository(Question) protected questionRepo: Repository<Question>) {}
    async getQuestions(query: GetQuestionsQueryParams) {}
}
