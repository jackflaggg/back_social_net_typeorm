import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentRepository } from '../../infrastructure/comment.repository';
import { calculateStatus } from '../../../../../core/utils/like/features/calculate.status';
import { StatusRepository } from '../../../posts/infrastructure/status.repository';
import { StatusLike } from '@libs/contracts/enums/status.like';
import { likeViewModel, StatusEntity, StatusModelType } from '../../../likes/domain/status,entity';
import { UserRepository } from '../../../../user-accounts/infrastructure/user/user.repository';
import { InjectModel } from '@nestjs/mongoose';

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
        private readonly commentsRepository: CommentRepository,
        private readonly statusRepository: StatusRepository,
        private readonly usersRepository: UserRepository,
        @InjectModel(StatusEntity.name) private readonly statusModel: StatusModelType,
    ) {}
    async execute(command: UpdateStatusCommentCommand) {
        const comment = await this.commentsRepository.findCommentById(command.commentId);
        const currentStatuses = await this.statusRepository.getStatus(comment._id.toString(), command.userId);

        let dislike: number = 0;
        let like: number = 0;

        if (currentStatuses) {
            await this.statusRepository.updateLikeStatus(comment._id.toString(), command.userId, command.status);

            const { dislikesCount, likesCount } = calculateStatus(currentStatuses, command.status);
            dislike = dislikesCount;
            like = likesCount;
        } else {
            const user = await this.usersRepository.findUserByIdOrFail(command.userId!);
            const dtoStatus: likeViewModel = {
                userId: user._id.toString(),
                userLogin: user.login,
                parentId: comment._id.toString(),
                status: command.status,
            };

            const newStatus = this.statusModel.buildInstance(dtoStatus);

            await this.statusRepository.save(newStatus);

            like = command.status === StatusLike.enum['Like'] ? 1 : 0;
            dislike = command.status === StatusLike.enum['Dislike'] ? 1 : 0;
        }

        const likesCount = comment.likesInfo.likesCount + like;

        const dislikesCount = comment.likesInfo.dislikesCount + dislike;

        const updatedComment = {
            likesCount: likesCount >= 0 ? likesCount : 0,
            dislikesCount: dislikesCount >= 0 ? dislikesCount : 0,
        };

        await this.commentsRepository.updateComment(comment._id.toString(), updatedComment);
    }
}
