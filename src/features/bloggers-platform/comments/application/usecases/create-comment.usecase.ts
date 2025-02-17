import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../../posts/infrastructure/post.repository';
import { CommentRepository } from '../../infrastructure/comment.repository';
import { InjectModel } from '@nestjs/mongoose';
import { CommentEntity, CommentModelType } from '../../domain/comment.entity';
import { CommentCreateToPostApi } from '../../../posts/dto/api/comment.create.to.post';
import { UserRepository } from '../../../../user-accounts/infrastructure/mongoose/user/user.repository';

// класс для создания комментария
export class CreateCommentCommand {
    constructor(
        public readonly payload: CommentCreateToPostApi,
        public readonly postId: string,
        public readonly userId: string,
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
        const post = await this.postsRepository.findPostByIdOrFail(command.postId);
        const user = await this.usersRepository.findUserByIdOrFail(command.userId);
        console.log('я нашел юзера: ' + user);
        const result = this.CommentModel.buildInstance(
            command.payload.content,
            { userId: user._id.toString(), userLogin: user.login },
            command.postId,
        );
        await this.commentsRepository.save(result);
        return result._id.toString();
    }
}
