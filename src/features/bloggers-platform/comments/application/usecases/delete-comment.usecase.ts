// класс для создания комментария
import { CommentRepository } from '../../infrastructure/comment.repository';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CheckUserCommentCommand } from './check-user-comment.usecase';
import { ForbiddenDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';

export class DeleteCommentCommand {
    constructor(
        public readonly commentId: string,
        public readonly userId: string,
    ) {}
}

// Этот декоратор связывает команду с соответствующим обработчиком.
// Когда команда CreateCommentCommand будет отправлена в систему,
// она будет автоматически направлена в класс CreateCommentUseCase для обработки.
// Это позволяет отделить команду от логики обработки
@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase implements ICommandHandler<DeleteCommentCommand> {
    constructor(
        private readonly commentsRepository: CommentRepository,
        private readonly commandBus: CommandBus,
    ) {}
    async execute(command: DeleteCommentCommand) {
        const comment = await this.commandBus.execute(new CheckUserCommentCommand(command.commentId, command.userId));
        if (comment.commentatorInfo.userId !== command.userId) {
            throw ForbiddenDomainException.create();
        }
        comment.makeDeleted();
        await this.commentsRepository.save(comment);
    }
}
