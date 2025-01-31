// класс для создания комментария
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class CheckUserCommentCommand {
    constructor(
        public readonly commentId: string,
        public readonly userId: string,
    ) {}
}

// Этот декоратор связывает команду с соответствующим обработчиком.
// Когда команда CreateCommentCommand будет отправлена в систему,
// она будет автоматически направлена в класс CreateCommentUseCase для обработки.
// Это позволяет отделить команду от логики обработки
@CommandHandler(CheckUserCommentCommand)
export class CheckUserCommentUseCase implements ICommandHandler<CheckUserCommentCommand> {
    constructor() {}
    async execute(command: CheckUserCommentCommand) {}
}
