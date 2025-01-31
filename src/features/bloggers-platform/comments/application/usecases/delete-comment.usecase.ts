// класс для создания комментария
import { CommentRepository } from '../../infrastructure/comment.repository';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { CommentEntity, CommentModelType } from '../../domain/comment.entity';

export class DeleteCommentCommand {
    constructor(
        public readonly commentId: string,
        public readonly userId: string,
    ) {}
}

// Этот декоратор связывает команду с соответствующим обработчиком.
// Когда команда CreateCommentCommand будет отправлена в систему,
// она будет автоматически направлена в класс CreateCommentUseCase для обработки.
// Это позволяет отделить команду от логики обработки
@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase implements ICommandHandler<DeleteCommentCommand> {
    constructor(
        private readonly commentsRepository: CommentRepository,
        private readonly commandBus: CommandBus,
        @InjectModel(CommentEntity.name) private CommentModel: CommentModelType,
    ) {}
    async execute(command: DeleteCommentCommand) {
        const comment = await this.commentsRepository.findPostById(command.commentId);
    }
}
