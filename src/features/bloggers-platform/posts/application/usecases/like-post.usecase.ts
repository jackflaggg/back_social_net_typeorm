import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { StatusPgRepository } from '../../../likes/infrastructure/postgres/status.pg.repository';
import { PostsPgRepository } from '../../infrastructure/postgres/posts.pg.repository';
import { PostsRepositoryOrm } from '../../infrastructure/typeorm/posts.pg.repository';
import { StatusRepositoryOrm } from '../../../likes/infrastructure/typeorm/statusRepositoryOrm';

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
        private readonly statusRepository: StatusRepositoryOrm,
        private readonly postsRepository: PostsRepositoryOrm,
    ) {}

    async execute(command: LikePostCommand) {
        const post = await this.postsRepository.findPostById(command.postId);
        const currenStatus = await this.statusRepository.getStatusPost(post.id, command.userId);
        if (!currenStatus) {
            await this.statusRepository.createLikeStatusPost(post.id, command.userId, command.status);
        }
        await this.statusRepository.updateLikeStatusPost(post.id, command.userId, command.status);
    }
}
