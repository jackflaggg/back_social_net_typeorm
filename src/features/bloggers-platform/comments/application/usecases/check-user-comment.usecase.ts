import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { CommentsRepositoryOrm } from '../../infrastructure/typeorm/commentsRepositoryOrm';
import { CommentToUser } from '../../domain/typeorm/comment.entity';

export class CheckUserCommentCommand {
    constructor(
        public readonly commentId: string,
        public readonly userId: string,
    ) {}
}

@CommandHandler(CheckUserCommentCommand)
export class CheckUserCommentUseCase implements ICommandHandler<CheckUserCommentCommand> {
    constructor(private readonly commentRepository: CommentsRepositoryOrm) {}
    async execute(command: CheckUserCommentCommand): Promise<CommentToUser> {
        const comment = await this.commentRepository.findCommentById(command.commentId);
        if (command.userId !== comment.commentatorId) {
            throw ForbiddenDomainException.create('это не ваш комментарий!', 'userid');
        }
        return comment;
    }
}
