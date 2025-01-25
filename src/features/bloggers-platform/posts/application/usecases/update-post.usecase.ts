import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/post.repository';
import { BlogsRepository } from '../../../blogs/infrastructure/blogs.repository';
import { PostUpdateDtoService } from '../../dto/service/post.update.dto';

export class UpdatePostCommand {
    constructor(
        public postId: string,
        public payload: PostUpdateDtoService,
    ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
    constructor(
        private readonly blogsRepository: BlogsRepository,
        private readonly postsRepository: PostsRepository,
    ) {}

    async execute(command: UpdatePostCommand) {
        const post = await this.postsRepository.findPostByIdOrFail(command.postId);
        const blog = await this.blogsRepository.findBlogByIdOrFail(command.payload.blogId);
        post.update(command.payload);
        await this.postsRepository.save(post);
    }
}
