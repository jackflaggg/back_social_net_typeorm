import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepositoryOrm } from '../../infrastructure/typeorm/blogs.pg.repository';

export class DeleteBlogCommand {
    constructor(public readonly blogId: string) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand> {
    constructor(private readonly blogRepository: BlogsRepositoryOrm) {}
    async execute(command: DeleteBlogCommand) {
        const blog = await this.blogRepository.findBlogById(command.blogId);

        await this.blogRepository.deleteBlog(blog);
    }
}
