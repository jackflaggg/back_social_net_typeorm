import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { StatusPgRepository } from '../../../likes/infrastructure/postgres/status.pg.repository';
import { PostsPgRepository } from '../../infrastructure/postgres/posts.pg.repository';
import { UserPgRepository } from '../../../../user-accounts/infrastructure/postgres/user/user.pg.repository';
import { calculateStatus } from '../../../../../core/utils/like/features/calculate.status';
import { likeViewModel } from '../../../likes/domain/status.entity';
import { StatusLike } from '../../../../../libs/contracts/enums/status.like';

export class LikePostCommand {
    constructor(
        public status: string,
        public postId: string,
        public userId: string | null,
    ) {}
}

@CommandHandler(LikePostCommand)
export class LikePostUseCase implements ICommandHandler<LikePostCommand> {
    constructor(
        private readonly statusRepository: StatusPgRepository,
        private readonly postsRepository: PostsPgRepository,
        private readonly usersRepository: UserPgRepository,
    ) {}

    async execute(command: LikePostCommand) {
        const post = await this.postsRepository.findPostById(command.postId);
        const currentStatuses = await this.statusRepository.getStatus(post._id.toString(), command.userId!);

        let dislike: number = 0;
        let like: number = 0;

        if (currentStatuses) {
            await this.statusRepository.updateLikeStatus(post.id, command.userId!, command.status);

            const { dislikesCount, likesCount } = calculateStatus(currentStatuses, command.status);
            dislike = dislikesCount;
            like = likesCount;
        } else {
            const user = await this.usersRepository.findUserById(command.userId!);
            const dtoStatus: likeViewModel = {
                userId: user._id.toString(),
                userLogin: user.login,
                parentId: post._id.toString(),
                status: command.status,
            };
            const newStatus = this.statusModel.buildInstance(dtoStatus);

            await this.statusRepository.save(newStatus);

            like = command.status === StatusLike.enum['Like'] ? 1 : 0;
            dislike = command.status === StatusLike.enum['Dislike'] ? 1 : 0;
        }

        const likesCount = post.extendedLikesInfo.likesCount + like;

        const dislikesCount = post.extendedLikesInfo.dislikesCount + dislike;

        const updatedComment = {
            likesCount: likesCount >= 0 ? likesCount : 0,
            dislikesCount: dislikesCount >= 0 ? dislikesCount : 0,
        };

        await this.postsRepository.updateCountStatusesPost(post.id.toString(), updatedComment);
    }
}
