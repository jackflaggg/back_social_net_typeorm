import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { InjectModel } from '@nestjs/mongoose';
import { PostsRepository } from '../../../posts/infrastructure/post.repository';
import { PostEntity, PostModelType } from '../../../posts/domain/post.entity';
import { PostToBlogCreateDtoApi } from '../../dto/api/blog.to.post.create.dto';

export class CreatePostToBlogCommand {
    constructor(
        public readonly blogId: string,
        public readonly payload: PostToBlogCreateDtoApi,
    ) {}
}

@CommandHandler(CreatePostToBlogCommand)
export class CreatePostToBlogUseCase implements ICommandHandler<CreatePostToBlogCommand> {
    constructor(
        private readonly blogRepository: BlogsRepository,
        private readonly postRepository: PostsRepository,
        @InjectModel(PostEntity.name) private PostModel: PostModelType,
    ) {}
    async execute(command: CreatePostToBlogCommand) {
        const blog = await this.blogRepository.findBlogByIdOrFail(command.blogId);
        const post = this.PostModel.buildInstance(command.payload, command.blogId, blog.name);
        await this.postRepository.save(post);
        return post._id.toString();
    }
}
