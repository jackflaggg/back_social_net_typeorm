import { BlogCreateDtoService } from '../../dto/service/blog.create.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsPgRepository } from '../../infrastructure/postgres/blogs.pg.repository';

export interface BlogCreateRepositoryDto extends BlogCreateDtoService {
    createdAt: string;
}
export class CreateBlogCommand {
    constructor(public readonly payload: BlogCreateDtoService) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
    constructor(private readonly blogRepository: BlogsPgRepository) {}
    async execute(command: CreateBlogCommand) {
        const dto: BlogCreateRepositoryDto = {
            ...command.payload,
            createdAt: new Date().toISOString(),
        };
        return await this.blogRepository.createBlog(dto);
    }
}
