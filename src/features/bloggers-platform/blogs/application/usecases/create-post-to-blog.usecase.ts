import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostToBlogCreateDtoApi } from '../../dto/api/blog.to.post.create.dto';
import { BlogsPgRepository } from '../../infrastructure/postgres/blogs.pg.repository';
import { PostsPgRepository } from '../../../posts/infrastructure/postgres/posts.pg.repository';

export class CreatePostToBlogCommand {
    constructor(
        public readonly blogId: string,
        public readonly payload: PostToBlogCreateDtoApi,
    ) {}
}

@CommandHandler(CreatePostToBlogCommand)
export class CreatePostToBlogUseCase implements ICommandHandler<CreatePostToBlogCommand> {
    constructor(
        private readonly blogRepository: BlogsPgRepository,
        private readonly postRepository: PostsPgRepository,
    ) {}
    async execute(command: CreatePostToBlogCommand) {
        const blog = await this.blogRepository.findBlogById(command.blogId);

        return await this.postRepository.createPost(command.payload, blog);
    }
}
