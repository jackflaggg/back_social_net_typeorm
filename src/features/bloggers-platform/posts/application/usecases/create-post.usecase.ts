import { PostCreateDtoService } from '../../dto/service/post.create.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../../blogs/infrastructure/blogs.repository';
import { PostsRepository } from '../../infrastructure/post.repository';
import { InjectModel } from '@nestjs/mongoose';
import { PostEntity, PostModelType } from '../../domain/post.entity';

export class CreatePostCommand {
    constructor(public payload: PostCreateDtoService) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
    constructor(
        private readonly blogsRepository: BlogsRepository,
        private readonly postsRepository: PostsRepository,
        @InjectModel(PostEntity.name) private readonly postModel: PostModelType,
    ) {}

    async execute(command: CreatePostCommand) {
        const blog = await this.blogsRepository.findBlogByIdOrFail(command.payload.blogId);
        const post = this.postModel.buildInstance(command.payload, command.payload.blogId, blog.name);
        await this.postsRepository.save(post);
        return post._id.toString();
    }
}
