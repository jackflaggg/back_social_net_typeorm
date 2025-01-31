import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentRepository } from '../../infrastructure/comment.repository';

export class UpdateContentCommentCommand {
    constructor(
        public readonly commentId: string,
        public readonly content: string,
    ) {}
}

// Этот декоратор связывает команду с соответствующим обработчиком.
// Когда команда CreateCommentCommand будет отправлена в систему,
// она будет автоматически направлена в класс CreateCommentUseCase для обработки.
// Это позволяет отделить команду от логики обработки
@CommandHandler(UpdateContentCommentCommand)
export class UpdateContentCommentUseCase implements ICommandHandler<UpdateContentCommentCommand> {
    constructor(private readonly commentsRepository: CommentRepository) {}
    async execute(command: UpdateContentCommentCommand) {}
}
