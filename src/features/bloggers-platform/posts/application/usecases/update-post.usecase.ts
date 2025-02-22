import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostUpdateDtoService } from '../../dto/service/post.update.dto';
import { BlogsPgRepository } from '../../../blogs/infrastructure/postgres/blogs.pg.repository';
import { PostsPgRepository } from '../../infrastructure/postgres/posts.pg.repository';
import { NotFoundDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';

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
        const blog = await this.blogsRepository.findBlogById(command.payload.blogId);

        const post = await this.postsRepository.findPostById(command.postId);
        if (!post) {
            throw NotFoundDomainException.create('пост не найден', 'postId');
        }
        await this.postsRepository.updatePost(command.payload, post.id);
    }
}
