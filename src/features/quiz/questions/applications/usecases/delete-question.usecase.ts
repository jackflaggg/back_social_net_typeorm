import { NotFoundDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionsRepository } from '../../infrastructure/typeorm/questions-repository';

export class DeleteQuestionCommand {
    constructor(public readonly id: string) {}
}

@CommandHandler(DeleteQuestionCommand)
export class DeleteQuestionUseCase implements ICommandHandler<DeleteQuestionCommand> {
    constructor(private readonly questionsRepository: QuestionsRepository) {}

    async execute(command: DeleteQuestionCommand): Promise<void> {
        const question = await this.questionsRepository.findQuestionById(command.id);

        if (!question) {
            throw NotFoundDomainException.create('Question not found');
        }

        await this.questionsRepository.deleteQuestion(question);
    }
}
