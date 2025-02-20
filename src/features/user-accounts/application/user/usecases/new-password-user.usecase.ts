import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { BadRequestDomainException, NotFoundDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { UserPgRepository } from '../../../infrastructure/postgres/user/user.pg.repository';
import { PasswordRecoveryPgRepository } from '../../../infrastructure/postgres/password/password.pg.recovery.repository';

export class NewPasswordUserCommand {
    constructor(
        public readonly newPassword: string,
        public readonly recoveryCode: string,
    ) {}
}

@CommandHandler(NewPasswordUserCommand)
export class NewPasswordUserUseCase implements ICommandHandler<NewPasswordUserCommand> {
    constructor(
        @Inject() private readonly usersRepository: UserPgRepository,
        @Inject() private readonly passwordRepository: PasswordRecoveryPgRepository,
    ) {}
    async execute(command: NewPasswordUserCommand) {
        const findCode = await this.passwordRepository.findCode(command.recoveryCode);

        if (!findCode) {
            throw NotFoundDomainException.create('произошла непредвиденная ошибка, код не найден', 'code');
        }

        if (findCode.used) {
            throw BadRequestDomainException.create('данный код был уже использован!', 'code');
        }

        const user = await this.usersRepository.findUserById(findCode.userId);
        user.setPasswordAdmin(command.newPassword);
        user.updateEmailConfirmation();

        await this.passwordRepository.updateStatus(findCode._id.toString());
    }
}
