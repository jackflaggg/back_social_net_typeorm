import { BlogCreateDtoService } from '../../dto/service/blog.create.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepositoryOrm } from '../../infrastructure/typeorm/blogs.pg.repository';
import { Blog } from '../../domain/typeorm/blog.entity';

export interface BlogCreateRepositoryDto extends BlogCreateDtoService {
    createdAt: Date;
}
export class CreateBlogCommand {
    constructor(public readonly payload: BlogCreateDtoService) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
    constructor(private readonly blogRepository: BlogsRepositoryOrm) {}
    async execute(command: CreateBlogCommand): Promise<string> {
        const dto: BlogCreateRepositoryDto = {
            ...command.payload,
            createdAt: new Date(),
        };
        const blogEntity = Blog.buildInstance(dto);
        return await this.blogRepository.save(blogEntity);
    }
}
