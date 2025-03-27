import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepositoryOrm } from '../../infrastructure/typeorm/posts.pg.repository';
import { StatusPostRepositoryOrm } from '../../../likes/infrastructure/typeorm/statusPostRepositoryOrm';

export class LikePostCommand {
    constructor(
        public status: string,
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
            await this.statusRepository.createLikeStatusPost(post.id, command.userId, command.status);
        }
        await this.statusRepository.updateLikeStatusPost(post, command.userId, command.status);
    }
}
