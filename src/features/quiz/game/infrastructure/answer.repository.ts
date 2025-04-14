import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from '../domain/answer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AnswerRepository {
    constructor(@InjectRepository(Answer) private answerRepositoryTypeOrm: Repository<Answer>) {}

    async createAnswer(answer: string): Promise<Answer> {
        const questionId = 1; //todo temporary
        const newAnswer = Answer.buildInstance(answer, questionId);
        await this.answerRepositoryTypeOrm.save(newAnswer);
        return newAnswer;
    }
}
