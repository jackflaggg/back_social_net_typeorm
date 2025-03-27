import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepositoryOrm } from '../../infrastructure/typeorm/commentsRepositoryOrm';
import { StatusPostRepositoryOrm } from '../../../likes/infrastructure/typeorm/statusPostRepositoryOrm';
import { StatusCommentRepositoryOrm } from '../../../likes/infrastructure/typeorm/status.comment.orm.repositoriy';

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
    constructor(
        private readonly commentsRepository: CommentsRepositoryOrm,
        private readonly statusRepository: StatusCommentRepositoryOrm,
    ) {}
    async execute(command: UpdateStatusCommentCommand) {
        const comment = await this.commentsRepository.findCommentById(command.commentId);

        const currentStatuses = await this.statusRepository.getStatusComment(comment.id, command.userId);

        if (!currentStatuses) {
            await this.statusRepository.createLikeStatusComment(comment.id, command.userId, command.status);
        }
        await this.statusRepository.updateLikeStatusComment(comment.id, command.userId, command.status);
    }
}
