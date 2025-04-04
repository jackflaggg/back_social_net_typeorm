import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepositoryOrm } from '../../infrastructure/typeorm/commentsRepositoryOrm';
import { StatusCommentRepositoryOrm } from '../../../likes/infrastructure/typeorm/status.comment.orm.repositoriy';
import { StatusLikeType } from '../../../../../libs/contracts/enums/status/status.like';

export class UpdateStatusCommentCommand {
    constructor(
        public readonly commentId: string,
        public readonly status: StatusLikeType,
        public readonly userId: string,
    ) {}
}

@CommandHandler(UpdateStatusCommentCommand)
export class UpdateStatusCommentUseCase implements ICommandHandler<UpdateStatusCommentCommand> {
    constructor(
        private readonly commentsRepository: CommentsRepositoryOrm,
        private readonly statusRepository: StatusCommentRepositoryOrm,
    ) {}
    async execute(command: UpdateStatusCommentCommand): Promise<void> {
        const comment = await this.commentsRepository.findCommentById(command.commentId);

        const currentStatuses = await this.statusRepository.getStatusComment(comment.id, command.userId);

        if (!currentStatuses) {
            return await this.statusRepository.createLikeStatusComment(comment.id, command.userId, command.status);
        }
        return await this.statusRepository.updateLikeStatusComment(currentStatuses, command.userId, command.status);
    }
}
