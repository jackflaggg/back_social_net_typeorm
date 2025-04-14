import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionPublishDto } from '../../dto/question-update.dto';
import { QuestionsRepository } from '../../infrastructure/typeorm/questions-repository';
import { NotFoundDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';

export class PublishQuestionCommand {
    constructor(
        public readonly id: string,
        public readonly payload: QuestionPublishDto,
    ) {}
}

@CommandHandler(PublishQuestionCommand)
export class PublishQuestionUseCase implements ICommandHandler<PublishQuestionCommand> {
    constructor(private readonly questionsRepository: QuestionsRepository) {}

    async execute(command: PublishQuestionCommand): Promise<void> {
        const question = await this.questionsRepository.findQuestionById(command.id);
        if (!question) {
            throw NotFoundDomainException.create('Question not found');
        }

        await this.questionsRepository.publishQuestion(question, command.payload);
    }
}
