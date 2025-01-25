import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';

export class DeleteBlogCommand {
    constructor(public readonly blogId: string) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand> {
    constructor(private readonly blogRepository: BlogsRepository) {}
    async execute(command: DeleteBlogCommand) {
        const blog = await this.blogRepository.findBlogByIdOrFail(command.blogId);

        blog.makeDeleted();

        await this.blogRepository.save(blog);
    }
}
