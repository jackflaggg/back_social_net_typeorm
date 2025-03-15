import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginDtoService } from '../../../dto/service/login.dto';
import { UserPgRepository } from '../../../infrastructure/postgres/user/user.pg.repository';
import { UserRepositoryOrm } from '../../../infrastructure/typeorm/user/user.orm.repo';

export class ValidateUserCommand {
    constructor(public readonly payload: LoginDtoService) {}
}

@CommandHandler(ValidateUserCommand)
export class ValidateUserUseCase implements ICommandHandler<ValidateUserCommand> {
    constructor(private readonly userRepository: UserRepositoryOrm) {}
    async execute(command: ValidateUserCommand) {
        const user = await this.userRepository.findUserByLoginOrEmail(command.payload.loginOrEmail);
        //return user._id.toString();
    }
}
