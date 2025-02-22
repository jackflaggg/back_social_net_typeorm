import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/post.repository';
import { BlogsRepository } from '../../../blogs/infrastructure/blogs.repository';
import { PostUpdateDtoService } from '../../dto/service/post.update.dto';
import { BlogsPgRepository } from '../../../blogs/infrastructure/postgres/blogs.pg.repository';
import { PostsPgRepository } from '../../infrastructure/postgres/posts.pg.repository';

export class UpdatePostCommand {
    constructor(
        public postId: string,
        public payload: PostUpdateDtoService,
    ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
    constructor(
        private readonly blogsRepository: BlogsPgRepository,
        private readonly postsRepository: PostsPgRepository,
    ) {}

    async execute(command: UpdatePostCommand) {
        const post = await this.postsRepository.findPostById(command.postId);
        const blog = await this.blogsRepository.findBlogById(command.payload.blogId);
        await this.postsRepository.updatePost();
    }
}
