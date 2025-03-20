import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsPgRepository } from '../../infrastructure/postgres/comments.pg.repository';
import { ForbiddenDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { CommentsRepositoryOrm } from '../../infrastructure/typeorm/commentsRepositoryOrm';

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
    constructor(private readonly commentRepository: CommentsRepositoryOrm) {}
    async execute(command: CheckUserCommentCommand) {
        const comment = await this.commentRepository.findCommentById(command.commentId);
        if (command.userId !== comment.userId) {
            throw ForbiddenDomainException.create('это не ваш комментарий!', 'userid');
        }
        return comment;
    }
}
