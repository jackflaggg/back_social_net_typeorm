import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserPgRepository } from '../../../infrastructure/postgres/user/user.pg.repository';
import { NotFoundDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';

export class DeleteUserCommand {
    constructor(public readonly userId: string) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand> {
    constructor(private readonly userRepository: UserPgRepository) {}
    async execute(command: DeleteUserCommand) {
        const userId = await this.userRepository.findUserById(command.userId);

        if (!userId) {
            throw NotFoundDomainException.create('Юзер не найден', 'userId');
        }

        await this.userRepository.updateDeletedAt(userId);
    }
}
