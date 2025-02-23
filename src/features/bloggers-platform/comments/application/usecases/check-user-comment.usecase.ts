// класс для создания комментария
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentRepository } from '../../infrastructure/comment.repository';
import { ForbiddenDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { CommentsPgRepository } from '../../infrastructure/postgres/comments.pg.repository';

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
    constructor(private readonly commentRepository: CommentsPgRepository) {}
    async execute(command: CheckUserCommentCommand) {
        const comment = await this.commentRepository.findCommentById(command.commentId);
        if (command.userId !== comment.commentatorInfo.userId) {
            throw ForbiddenDomainException.create('это не ваш комментарий!', 'userid');
        }
        return comment;
    }
}
