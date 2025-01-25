import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../../posts/infrastructure/post.repository';
import { CommentRepository } from '../../infrastructure/comment.repository';
import { UserRepository } from '../../../../user-accounts/infrastructure/user.repository';
import { InjectModel } from '@nestjs/mongoose';
import { CommentEntity, CommentModelType } from '../../domain/comment.entity';
import { NotFoundDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { CommentCreateToPostApi } from '../../../posts/dto/api/comment.create.to.post';

// класс для создания комментария
export class CreateCommentCommand {
    constructor(
        public readonly payload: CommentCreateToPostApi,
        public readonly postId: string,
        public readonly user: any,
    ) {}
}

// Этот декоратор связывает команду с соответствующим обработчиком.
// Когда команда CreateCommentCommand будет отправлена в систему,
// она будет автоматически направлена в класс CreateCommentUseCase для обработки.
// Это позволяет отделить команду от логики обработки
@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase implements ICommandHandler<CreateCommentCommand> {
    constructor(
        private readonly postsRepository: PostsRepository,
        private readonly usersRepository: UserRepository,
        private readonly commentsRepository: CommentRepository,
        @InjectModel(CommentEntity.name) private CommentModel: CommentModelType,
    ) {}
    async execute(command: CreateCommentCommand) {
        const post = await this.postsRepository.findPostById(command.postId);
        if (!post) {
            throw NotFoundDomainException.create('Post not found');
        }
        const user = await this.usersRepository.findUserById(command.user.userId);
        if (!user) {
            throw NotFoundDomainException.create('User not found');
        }
        const result = this.CommentModel.buildInstance(command.payload);
        await this.commentsRepository.save(result);
        return result._id.toString();
    }
}
