import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentCreateToPostApi } from '../../../posts/dto/api/comment.create.to.post';
import { UserPgRepository } from '../../../../user-accounts/infrastructure/postgres/user/user.pg.repository';
import { PostsPgRepository } from '../../../posts/infrastructure/postgres/posts.pg.repository';
import { CommentsPgRepository } from '../../infrastructure/postgres/comments.pg.repository';

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
        const user = await this.usersRepository.findUserById(command.userId);
        console.log('я нашел юзера: ' + user);
        // const result = this.CommentModel.buildInstance(
        //     command.payload.content,
        //     { userId: user._id.toString(), userLogin: user.login },
        //     command.postId,
        // );
        // await this.commentsRepository.save(result);
        // return result._id.toString();
    }
}
