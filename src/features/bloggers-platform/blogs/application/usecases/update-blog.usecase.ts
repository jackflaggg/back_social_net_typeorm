import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogUpdateDtoService } from '../../dto/service/blog.update.dto';
import { BlogsPgRepository } from '../../infrastructure/postgres/blogs.pg.repository';
import { NotFoundDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';

export class UpdateBlogCommand {
    constructor(
        public readonly blogId: string,
        public readonly payload: BlogUpdateDtoService,
    ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
    constructor(private readonly blogRepository: BlogsPgRepository) {}
    async execute(command: UpdateBlogCommand) {
        const blog = await this.blogRepository.findBlogById(command.blogId);
        if (!blog) {
            throw NotFoundDomainException.create('блог не найден', 'blogId');
        }
        await this.blogRepository.updateBlog(blog, command.payload.name, command.payload.description, command.payload.websiteUrl);
    }
}
