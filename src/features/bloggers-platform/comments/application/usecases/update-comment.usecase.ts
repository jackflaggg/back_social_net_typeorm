import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenDomainException, NotFoundDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { CommentsPgRepository } from '../../infrastructure/postgres/comments.pg.repository';

export class UpdateContentCommentCommand {
    constructor(
        public readonly commentId: string,
        public readonly content: string,
        public readonly userId: string,
    ) {}
}

// Этот декоратор связывает команду с соответствующим обработчиком.
// Когда команда CreateCommentCommand будет отправлена в систему,
// она будет автоматически направлена в класс CreateCommentUseCase для обработки.
// Это позволяет отделить команду от логики обработки
@CommandHandler(UpdateContentCommentCommand)
export class UpdateContentCommentUseCase implements ICommandHandler<UpdateContentCommentCommand> {
    constructor(private readonly commentsRepository: CommentsPgRepository) {}
    async execute(command: UpdateContentCommentCommand) {
        const comment = await this.commentsRepository.findCommentById(command.commentId);
        if (!comment) {
            throw NotFoundDomainException.create('комментарий не существует!', 'commentId');
        }
        if (comment.userId !== command.userId) {
            throw ForbiddenDomainException.create();
        }
        await this.commentsRepository.updateComment(comment.id, command.content);
    }
}
