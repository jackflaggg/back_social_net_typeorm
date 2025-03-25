import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepositoryOrm } from '../../infrastructure/typeorm/blogs.pg.repository';
import { PostsRepositoryOrm } from '../../../posts/infrastructure/typeorm/posts.pg.repository';
import { Post } from '../../../posts/domain/typeorm/post.entity';

export class DeletePostToBlogCommand {
    constructor(
        public readonly blogId: string,
        public readonly postId: string,
    ) {}
}

@CommandHandler(DeletePostToBlogCommand)
export class DeletePostToBlogUseCase implements ICommandHandler<DeletePostToBlogCommand> {
    constructor(
        private readonly blogRepository: BlogsRepositoryOrm,
        private readonly postRepository: PostsRepositoryOrm,
    ) {}
    async execute(command: DeletePostToBlogCommand): Promise<void> {
        await this.blogRepository.findBlogById(command.blogId);

        const post: Post = await this.postRepository.findPostById(command.postId);

        await this.postRepository.deletePost(post);
    }
}
