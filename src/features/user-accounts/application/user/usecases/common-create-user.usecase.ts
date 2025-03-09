import { UserCreateDtoService } from '../../../dto/service/user.create.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { emailConfirmationData } from '../../../../../core/utils/user/email-confirmation-data.admin';
import { UserPgRepository } from '../../../infrastructure/postgres/user/user.pg.repository';
import { BcryptService } from '../../services/bcrypt.service';
import { Inject } from '@nestjs/common';

export class CommonCreateUserCommand {
    constructor(public readonly payload: UserCreateDtoService) {}
}

@CommandHandler(CommonCreateUserCommand)
export class CommonCreateUserUseCase implements ICommandHandler<CommonCreateUserCommand> {
    constructor(
        @Inject() private readonly usersRepository: UserPgRepository,
        private readonly bcryptService: BcryptService,
    ) {}
    async execute(command: CommonCreateUserCommand) {
        const hashPassword = await this.bcryptService.hashPassword(command.payload.password);
        return await this.usersRepository.createUser(
            { ...command.payload, password: hashPassword, createdAt: new Date() },
            emailConfirmationData(),
        );
    }
}
