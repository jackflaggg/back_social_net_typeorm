import { PostCreateDtoService } from '../../dto/service/post.create.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsPgRepository } from '../../../blogs/infrastructure/postgres/blogs.pg.repository';
import { PostsPgRepository } from '../../infrastructure/postgres/posts.pg.repository';
import { BlogsRepositoryOrm } from '../../../blogs/infrastructure/typeorm/blogs.pg.repository';
import { PostsRepositoryOrm } from '../../infrastructure/typeorm/posts.pg.repository';

export class CreatePostCommand {
    constructor(public payload: PostCreateDtoService) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
    constructor(
        private readonly blogsRepository: BlogsRepositoryOrm,
        private readonly postsRepository: PostsRepositoryOrm,
    ) {}

    async execute(command: CreatePostCommand) {
        const blogId = await this.blogsRepository.findBlogById(command.payload.blogId);
        // return await this.postsRepository.createPost(command.payload, blogId);
    }
}
