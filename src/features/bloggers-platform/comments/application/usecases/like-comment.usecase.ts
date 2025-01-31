import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentRepository } from '../../infrastructure/comment.repository';
import { ForbiddenDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';

export class UpdateStatusCommentCommand {
    constructor(
        public readonly commentId: string,
        public readonly status: string,
        public readonly userId: string,
    ) {}
}

// Этот декоратор связывает команду с соответствующим обработчиком.
// Когда команда CreateCommentCommand будет отправлена в систему,
// она будет автоматически направлена в класс CreateCommentUseCase для обработки.
// Это позволяет отделить команду от логики обработки
@CommandHandler(UpdateStatusCommentCommand)
export class UpdateStatusCommentUseCase implements ICommandHandler<UpdateStatusCommentCommand> {
    constructor(private readonly commentsRepository: CommentRepository) {}
    async execute(command: UpdateStatusCommentCommand) {
        const comment = await this.commentsRepository.findCommentById(command.commentId);
        if (comment.commentatorInfo.userId !== command.userId) {
            throw ForbiddenDomainException.create();
        }
        comment.updateStatus(command.status);
        await this.commentsRepository.save(comment);
    }
}
