import { QuestionCreateDtoApi } from '../../dto/api/create.question.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionsRepository } from '../../infrastructure/typeorm/questions-repository';

export class DeleteQuestionCommand {
    constructor(public readonly payload: QuestionCreateDtoApi) {}
}

@CommandHandler(DeleteQuestionCommand)
export class DeleteQuestionUseCase implements ICommandHandler<DeleteQuestionCommand> {
    constructor(private questionRepo: QuestionsRepository) {}
    async execute(command: DeleteQuestionCommand) {}
}
