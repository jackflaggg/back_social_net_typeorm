import { BlogUpdateDtoService } from '../../dto/service/blog.update.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsPgRepository } from '../../infrastructure/postgres/blogs.pg.repository';
import { NotFoundDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { PostUpdateDtoApi } from '../../../posts/dto/api/post.update.dto';

export class UpdatePostToBlogCommand {
    constructor(
        public readonly blogId: string,
        public readonly postId: string,
        public readonly dto: PostUpdateDtoApi,
    ) {}
}

@CommandHandler(UpdatePostToBlogCommand)
export class UpdatePostToBlogUseCase implements ICommandHandler<UpdatePostToBlogCommand> {
    constructor(private readonly blogRepository: BlogsPgRepository) {}
    async execute(command: UpdatePostToBlogCommand) {
        const blog = await this.blogRepository.findBlogById(command.blogId);
        if (!blog) {
            throw NotFoundDomainException.create('блог не найден', 'blogId');
        }
        await this.blogRepository.updateBlog(blog, command.payload.name, command.payload.description, command.payload.websiteUrl);
    }
}
