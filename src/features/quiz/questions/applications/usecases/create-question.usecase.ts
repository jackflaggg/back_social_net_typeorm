import { QuestionCreateDtoApi } from '../../dto/api/create.question.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionsRepository } from '../../infrastructure/typeorm/questions-repository';

export class CreateQuestionCommand {
    constructor(public readonly payload: QuestionCreateDtoApi) {}
}

@CommandHandler(CreateQuestionCommand)
export class CreateQuestionUseCase implements ICommandHandler<CreateQuestionCommand> {
    constructor(private questionRepo: QuestionsRepository) {}
    async execute(command: CreateQuestionCommand) {}
}
