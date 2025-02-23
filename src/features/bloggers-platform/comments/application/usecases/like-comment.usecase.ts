import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserPgRepository } from '../../../../user-accounts/infrastructure/postgres/user/user.pg.repository';
import { CommentsPgRepository } from '../../infrastructure/postgres/comments.pg.repository';
import { StatusPgRepository } from '../../../likes/infrastructure/postgres/status.pg.repository';
import { calculateStatus } from '../../../../../core/utils/like/features/calculate.status';
import { likeViewModel } from '../../../likes/domain/status.entity';
import { StatusLike } from '../../../../../libs/contracts/enums/status.like';

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
        private readonly commentsRepository: CommentsPgRepository,
        private readonly statusRepository: StatusPgRepository,
        private readonly usersRepository: UserPgRepository,
    ) {}
    async execute(command: UpdateStatusCommentCommand) {
        const comment = await this.commentsRepository.findCommentById(command.commentId);

        const currentStatuses = await this.statusRepository.getStatusComment(comment.id, command.userId);

        let dislike: number = 0;
        let like: number = 0;

        if (currentStatuses) {
            await this.statusRepository.createLikeStatusComment(comment.id, command.userId, command.status);

            const { dislikesCount, likesCount } = calculateStatus(currentStatuses, command.status);
            dislike = dislikesCount;
            like = likesCount;
        } else {
            const user = await this.usersRepository.findUserById(command.userId!);
            const dtoStatus: likeViewModel = {
                userId: user.id.toString(),
                userLogin: user.login,
                parentId: comment.id.toString(),
                status: command.status,
            };

            like = command.status === StatusLike.enum['Like'] ? 1 : 0;
            dislike = command.status === StatusLike.enum['Dislike'] ? 1 : 0;
        }
    }
}
