import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostUpdateDtoApi } from '../../../posts/dto/api/post.update.dto';
import { BlogsRepositoryOrm } from '../../infrastructure/typeorm/blogs.pg.repository';
import { PostsRepositoryOrm } from '../../../posts/infrastructure/typeorm/posts.pg.repository';
import { Blog } from '../../domain/typeorm/blog.entity';
import { Post } from '../../../posts/domain/typeorm/post.entity';

export class UpdatePostToBlogCommand {
    constructor(
        public readonly blogId: string,
        public readonly postId: string,
        public readonly dto: PostUpdateDtoApi,
    ) {}
}

@CommandHandler(UpdatePostToBlogCommand)
export class UpdatePostToBlogUseCase implements ICommandHandler<UpdatePostToBlogCommand> {
    constructor(
        private readonly blogRepository: BlogsRepositoryOrm,
        private readonly postRepository: PostsRepositoryOrm,
    ) {}
    async execute(command: UpdatePostToBlogCommand): Promise<void> {
        const blog: Blog = await this.blogRepository.findBlogById(command.blogId);

        const post: Post = await this.postRepository.findPostById(command.postId);

        post.update(command.dto);

        await this.postRepository.save(post);
    }
}
