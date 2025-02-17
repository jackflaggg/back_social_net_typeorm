import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../../infrastructure/mongoose/user/user.repository';

export class DeleteUserCommand {
    constructor(public readonly userId: string) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand> {
    constructor(private readonly userRepository: UserRepository) {}
    async execute(command: DeleteUserCommand) {
        const user = await this.userRepository.findUserByIdOrFail(command.userId);

        user.makeDeleted();

        await this.userRepository.save(user);
    }
}
