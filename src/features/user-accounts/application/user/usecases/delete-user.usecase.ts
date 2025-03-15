import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepositoryOrm } from '../../../infrastructure/typeorm/user/user.orm.repo';

export class DeleteUserCommand {
    constructor(public readonly userId: string) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand> {
    constructor(private readonly userRepository: UserRepositoryOrm) {}
    async execute(command: DeleteUserCommand) {
        const userId = await this.userRepository.findUserById(command.userId);

        await this.userRepository.updateDeletedAt(userId);
    }
}
