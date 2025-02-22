import { PostUpdateDtoApi } from '../../../posts/dto/api/post.update.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsPgRepository } from '../../infrastructure/postgres/blogs.pg.repository';
import { NotFoundDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';

export class DeletePostToBlogCommand {
    constructor(
        public readonly blogId: string,
        public readonly postId: string,
    ) {}
}

@CommandHandler(DeletePostToBlogCommand)
export class DeletePostToBlogUseCase implements ICommandHandler<DeletePostToBlogCommand> {
    constructor(private readonly blogRepository: BlogsPgRepository) {}
    async execute(command: DeletePostToBlogCommand) {
        const blog = await this.blogRepository.findBlogById(command.blogId);
        if (!blog) {
            throw NotFoundDomainException.create('блог не найден', 'blogId');
        }
        await this.blogRepository.updateBlog(blog, command.payload.name, command.payload.description, command.payload.websiteUrl);
    }
}
