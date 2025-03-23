import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepositoryOrm } from '../../infrastructure/typeorm/posts.pg.repository';

export class DeletePostCommand {
    constructor(public postId: string) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
    constructor(private readonly postsRepository: PostsRepositoryOrm) {}

    async execute(command: DeletePostCommand): Promise<void> {
        const result = await this.postsRepository.findPostById(command.postId);
        await this.postsRepository.deletePost(result);
    }
}
