import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserPgRepository } from '../../../infrastructure/postgres/user/user.pg.repository';

export class DeleteUserCommand {
    constructor(public readonly userId: string) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand> {
    constructor(private readonly userRepository: UserPgRepository) {}
    async execute(command: DeleteUserCommand) {
        const user = await this.userRepository.findUserById(command.userId);

        await this.userRepository.updateDeletedAt(user.id);
    }
}
