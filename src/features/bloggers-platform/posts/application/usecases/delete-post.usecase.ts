import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/post.repository';

export class DeletePostCommand {
    constructor(public postId: string) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
    constructor(private readonly postsRepository: PostsRepository) {}

    async execute(command: DeletePostCommand) {
        const result = await this.postsRepository.findPostByIdOrFail(command.postId);
        result.makeDeleted();
        await this.postsRepository.save(result);
    }
}
