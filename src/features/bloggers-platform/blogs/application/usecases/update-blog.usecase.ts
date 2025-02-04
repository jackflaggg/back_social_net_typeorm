import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { InjectModel } from '@nestjs/mongoose';
import { BlogEntity, BlogModelType } from '../../domain/blog.entity';
import { BlogUpdateDtoService } from '../../dto/service/blog.update.dto';

export class UpdateBlogCommand {
    constructor(
        public readonly blogId: string,
        public readonly payload: BlogUpdateDtoService,
    ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
    constructor(
        private readonly blogRepository: BlogsRepository,
        @InjectModel(BlogEntity.name) private BlogModel: BlogModelType,
    ) {}
    async execute(command: UpdateBlogCommand) {
        const blog = await this.blogRepository.findBlogByIdOrFail(command.blogId);
        blog.update(command.payload);
        await this.blogRepository.save(blog);
        return blog._id.toString();
    }
}
