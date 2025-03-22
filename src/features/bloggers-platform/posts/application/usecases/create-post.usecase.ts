import { PostCreateDtoService } from '../../dto/service/post.create.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepositoryOrm } from '../../../blogs/infrastructure/typeorm/blogs.pg.repository';
import { PostsRepositoryOrm } from '../../infrastructure/typeorm/posts.pg.repository';
import { Blog } from '../../../blogs/domain/typeorm/blog.entity';
import { Post } from '../../domain/typeorm/post.entity';

export class CreatePostCommand {
    constructor(public payload: PostCreateDtoService) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
    constructor(
        private readonly blogsRepository: BlogsRepositoryOrm,
        private readonly postsRepository: PostsRepositoryOrm,
    ) {}

    async execute(command: CreatePostCommand): Promise<string> {
        const blog: Blog = await this.blogsRepository.findBlogById(command.payload.blogId);
        const postEntity = Post.buildInstance(command.payload, blog.id);
        return await this.postsRepository.save(postEntity);
    }
}
