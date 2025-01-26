import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../../infrastructure/user.repository';
import { LoginDtoService } from '../../../dto/service/login.dto';

export class LoginUserCommand {
    constructor(public readonly payload: LoginDtoService) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserUseCase implements ICommandHandler<LoginUserCommand> {
    constructor(private readonly userRepository: UserRepository) {}
    async execute(command: LoginUserCommand) {
        const user = await this.userRepository.findUserByIdOrFail(command.payload.loginOrEmail);

        user.makeDeleted();

        await this.userRepository.save(user);
    }
}
