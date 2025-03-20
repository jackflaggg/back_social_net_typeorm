import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostToBlogCreateDtoApi } from '../../dto/api/blog.to.post.create.dto';
import { BlogsRepositoryOrm } from '../../infrastructure/typeorm/blogs.pg.repository';
import { PostsRepositoryOrm } from '../../../posts/infrastructure/typeorm/posts.pg.repository';

export class CreatePostToBlogCommand {
    constructor(
        public readonly blogId: string,
        public readonly payload: PostToBlogCreateDtoApi,
    ) {}
}

@CommandHandler(CreatePostToBlogCommand)
export class CreatePostToBlogUseCase implements ICommandHandler<CreatePostToBlogCommand> {
    constructor(
        private readonly blogRepository: BlogsRepositoryOrm,
        private readonly postRepository: PostsRepositoryOrm,
    ) {}
    async execute(command: CreatePostToBlogCommand) {
        const blog = await this.blogRepository.findBlogById(command.blogId);

        return await this.postRepository.createPost(command.payload, blog);
    }
}
