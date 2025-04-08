import { QuestionCreateDtoApi } from '../../dto/api/create.question.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionsRepository } from '../../infrastructure/typeorm/questions-repository';

export class PublishQuestionCommand {
    constructor(public readonly payload: QuestionCreateDtoApi) {}
}

@CommandHandler(PublishQuestionCommand)
export class PublishQuestionUseCase implements ICommandHandler<PublishQuestionCommand> {
    constructor(private questionRepo: QuestionsRepository) {}
    async execute(command: PublishQuestionCommand) {}
}
