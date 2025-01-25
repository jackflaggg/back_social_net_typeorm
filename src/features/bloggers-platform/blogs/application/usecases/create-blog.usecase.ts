import { BlogCreateDtoService } from '../../dto/service/blog.create.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { BlogEntity, BlogModelType } from '../../domain/blog.entity';
import { InjectModel } from '@nestjs/mongoose';

export class CreateBlogCommand {
    constructor(public readonly payload: BlogCreateDtoService) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
    constructor(
        private readonly blogRepository: BlogsRepository,
        @InjectModel(BlogEntity.name) private BlogModel: BlogModelType,
    ) {}
    async execute(command: CreateBlogCommand) {
        const blog = this.BlogModel.buildInstance(command.payload);
        await this.blogRepository.save(blog);
        return blog._id.toString();
    }
}
