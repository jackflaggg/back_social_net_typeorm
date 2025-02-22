import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/post.repository';
import { PostsPgRepository } from '../../infrastructure/postgres/posts.pg.repository';

export class DeletePostCommand {
    constructor(public postId: string) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
    constructor(private readonly postsRepository: PostsPgRepository) {}

    async execute(command: DeletePostCommand) {
        const result = await this.postsRepository.findPostById(command.postId);
        await this.postsRepository.deletePost(result.id);
    }
}
