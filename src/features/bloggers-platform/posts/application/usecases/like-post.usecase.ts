import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepositoryOrm } from '../../infrastructure/typeorm/posts.pg.repository';
import { StatusPostRepositoryOrm } from '../../../likes/infrastructure/typeorm/statusPostRepositoryOrm';
import { StatusLikeType } from '../../../../../libs/contracts/enums/status/status.like';

export class LikePostCommand {
    constructor(
        public status: StatusLikeType,
        public postId: string,
        public userId: string,
    ) {}
}

@CommandHandler(LikePostCommand)
export class LikePostUseCase implements ICommandHandler<LikePostCommand> {
    constructor(
        private readonly statusRepository: StatusPostRepositoryOrm,
        private readonly postsRepository: PostsRepositoryOrm,
    ) {}

    async execute(command: LikePostCommand) {
        const post = await this.postsRepository.findPostById(command.postId);
        const currenStatus = await this.statusRepository.getStatusPost(post.id, command.userId);
        if (!currenStatus) {
            return await this.statusRepository.createLikeStatusPost(post.id, command.userId, command.status);
        }
        return await this.statusRepository.updateLikeStatusPost(currenStatus, command.userId, command.status);
    }
}
