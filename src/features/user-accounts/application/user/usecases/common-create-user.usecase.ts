import { UserCreateDtoService } from '../../../dto/service/user.create.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { emailConfirmationData } from '../../../../../core/utils/user/email-confirmation-data.admin';
import { UserPgRepository } from '../../../infrastructure/postgres/user/user.pg.repository';
import { BcryptService } from '../../bcrypt.service';

export class CommonCreateUserCommand {
    constructor(public readonly payload: UserCreateDtoService) {}
}

@CommandHandler(CommonCreateUserCommand)
export class CommonCreateUserUseCase implements ICommandHandler<CommonCreateUserCommand> {
    constructor(
        private readonly userRepository: UserPgRepository,
        private readonly bcryptService: BcryptService,
    ) {}
    async execute(command: CommonCreateUserCommand) {
        const extensionDto = {
            ...command.payload,
            ...emailConfirmationData(),
        };
    }
}
