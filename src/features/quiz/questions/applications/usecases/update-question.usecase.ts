import { NotFoundDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { QuestionUpdateDto } from '../../dto/question-update.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionsRepository } from '../../infrastructure/typeorm/questions-repository';

export class UpdateQuestionCommand {
    constructor(
        public readonly id: string,
        public readonly payload: QuestionUpdateDto,
    ) {}
}

@CommandHandler(UpdateQuestionCommand)
export class UpdateQuestionUseCase implements ICommandHandler<UpdateQuestionCommand> {
    constructor(private readonly questionsRepository: QuestionsRepository) {}

    async execute(command: UpdateQuestionCommand): Promise<void> {
        const question = await this.questionsRepository.findQuestionById(command.id);
        if (!question) {
            throw NotFoundDomainException.create('Question not found');
        }

        await this.questionsRepository.updateQuestion(question, command.payload);
    }
}
