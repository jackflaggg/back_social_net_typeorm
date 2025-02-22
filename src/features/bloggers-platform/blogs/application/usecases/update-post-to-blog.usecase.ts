import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsPgRepository } from '../../infrastructure/postgres/blogs.pg.repository';
import { NotFoundDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { PostUpdateDtoApi } from '../../../posts/dto/api/post.update.dto';
import { PostsPgRepository } from '../../../posts/infrastructure/postgres/posts.pg.repository';

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
        private readonly blogRepository: BlogsPgRepository,
        private readonly postRepository: PostsPgRepository,
    ) {}
    async execute(command: UpdatePostToBlogCommand) {
        const blog = await this.blogRepository.findBlogById(command.blogId);

        if (!blog) {
            throw NotFoundDomainException.create('блог не найден', 'blogId');
        }

        const postId = await this.postRepository.findPostById(command.postId);

        if (!postId) {
            throw NotFoundDomainException.create('пост не найден', 'postId');
        }

        await this.postRepository.updatePost(command.dto, postId.id);
    }
}
