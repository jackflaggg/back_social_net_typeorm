import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostUpdateDtoService } from '../../dto/service/post.update.dto';
import { BlogsRepositoryOrm } from '../../../blogs/infrastructure/typeorm/blogs.pg.repository';
import { PostsRepositoryOrm } from '../../infrastructure/typeorm/posts.pg.repository';
import { Post } from '../../domain/typeorm/post.entity';

export class UpdatePostCommand {
    constructor(
        public postId: string,
        public payload: PostUpdateDtoService,
    ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
    constructor(
        private readonly blogsRepository: BlogsRepositoryOrm,
        private readonly postsRepository: PostsRepositoryOrm,
    ) {}

    async execute(command: UpdatePostCommand) {
        await this.blogsRepository.findBlogById(command.postId);

        const post: Post = await this.postsRepository.findPostById(command.postId);

        await this.postsRepository.updatePost(command.payload, post);
    }
}
