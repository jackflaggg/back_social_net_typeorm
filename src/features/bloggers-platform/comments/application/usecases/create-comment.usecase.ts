import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentCreateToPostApi } from '../../../posts/dto/api/comment.create.to.post';
import { UserPgRepository } from '../../../../user-accounts/infrastructure/postgres/user/user.pg.repository';
import { PostsPgRepository } from '../../../posts/infrastructure/postgres/posts.pg.repository';
import { CommentsPgRepository } from '../../infrastructure/postgres/comments.pg.repository';
import { NotFoundDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';

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
        private readonly postsRepository: PostsPgRepository,
        private readonly usersRepository: UserPgRepository,
        private readonly commentsRepository: CommentsPgRepository,
    ) {}
    async execute(command: CreateCommentCommand) {
        const post = await this.postsRepository.findPostById(command.postId);
        if (!post) {
            throw NotFoundDomainException.create('пост не найден', 'postId');
        }
        const user = await this.usersRepository.findUserById(command.userId);

        const comment = await this.commentsRepository.createComment(command.payload.content, post.id, user.id);
        return comment[0].id;
    }
}
