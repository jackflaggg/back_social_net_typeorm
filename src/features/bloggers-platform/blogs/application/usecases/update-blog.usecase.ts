import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogUpdateDtoService } from '../../dto/service/blog.update.dto';
import { BlogsRepositoryOrm } from '../../infrastructure/typeorm/blogs.pg.repository';
import { Blog } from '../../domain/typeorm/blog.entity';

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
        const blog: Blog = await this.blogRepository.findBlogById(command.blogId);
        await this.blogRepository.updateBlog(command.payload, blog);
    }
}
