import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/post.repository';
import { InjectModel } from '@nestjs/mongoose';
import { calculateStatus } from '../../../../../core/utils/like/features/calculate.status';
import { StatusRepository } from '../../infrastructure/status.repository';
import { likeViewModel, StatusEntity, StatusModelType } from '../../../likes/domain/status.entity';
import { UserRepository } from '../../../../user-accounts/infrastructure/user/user.repository';
import { StatusLike } from 'libs/contracts/enums/status.like';

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
        private readonly statusRepository: StatusRepository,
        private readonly postsRepository: PostsRepository,
        private readonly usersRepository: UserRepository,
        @InjectModel(StatusEntity.name) private readonly statusModel: StatusModelType,
    ) {}

    async execute(command: LikePostCommand) {
        const post = await this.postsRepository.findPostByIdOrFail(command.postId);
        const currentStatuses = await this.statusRepository.getStatusPost(post._id.toString(), command.userId!);

        let dislike: number = 0;
        let like: number = 0;

        if (currentStatuses) {
            await this.statusRepository.updateLikeStatus(post._id.toString(), command.userId!, command.status);

            const { dislikesCount, likesCount } = calculateStatus(currentStatuses, command.status);
            dislike = dislikesCount;
            like = likesCount;
        } else {
            const user = await this.usersRepository.findUserByIdOrFail(command.userId!);
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

        await this.postsRepository.updateCountStatusesPost(post._id.toString(), updatedComment);
    }
}
