import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogUpdateDtoService } from '../../dto/service/blog.update.dto';
import { BlogsRepositoryOrm } from '../../infrastructure/typeorm/blogs.pg.repository';

export class UpdateBlogCommand {
    constructor(
        public readonly blogId: string,
        public readonly payload: BlogUpdateDtoService,
    ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
    constructor(private readonly blogRepository: BlogsRepositoryOrm) {}
    async execute(command: UpdateBlogCommand) {
        const blog = await this.blogRepository.findBlogById(command.blogId);
        blog.update(command.payload);
        await this.blogRepository.save(blog);
        // await this.blogRepository.updateBlog(blogId, command.payload.name, command.payload.description, command.payload.websiteUrl);
    }
}
