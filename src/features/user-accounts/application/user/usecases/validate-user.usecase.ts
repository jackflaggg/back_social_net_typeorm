import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginDtoService } from '../../../dto/service/login.dto';
import { UserRepositoryOrm } from '../../../infrastructure/typeorm/user/user.orm.repo';
import { NotFoundDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';

export class ValidateUserCommand {
    constructor(public readonly payload: LoginDtoService) {}
}

@CommandHandler(ValidateUserCommand)
export class ValidateUserUseCase implements ICommandHandler<ValidateUserCommand> {
    constructor(private readonly userRepository: UserRepositoryOrm) {}
    async execute(command: ValidateUserCommand) {
        const user = await this.userRepository.findUserByLoginOrEmail(command.payload.loginOrEmail);
        if (!user) {
            throw NotFoundDomainException.create('Юзер не найден', 'ValidateUserUseCase');
        }
        return user.id;
    }
}
