import { QuestionCreateDtoApi } from '../../dto/api/create.question.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionsRepository } from '../../infrastructure/typeorm/questions-repository';

export class UpdateQuestionCommand {
    constructor(public readonly payload: QuestionCreateDtoApi) {}
}

@CommandHandler(UpdateQuestionCommand)
export class CreateQuestionUseCase implements ICommandHandler<UpdateQuestionCommand> {
    constructor(private questionRepo: QuestionsRepository) {}
    async execute(command: UpdateQuestionCommand) {}
}
