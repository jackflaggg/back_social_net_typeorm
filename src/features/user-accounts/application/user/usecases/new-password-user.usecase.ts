import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UserRepository } from '../../../infrastructure/user/user.repository';
import { PasswordRecoveryDbRepository } from '../../../infrastructure/password/password.recovery.repository';
import { BadRequestDomainException, NotFoundDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';

export class NewPasswordUserCommand {
    constructor(
        public readonly newPassword: string,
        public readonly recoveryCode: string,
    ) {}
}

@CommandHandler(NewPasswordUserCommand)
export class NewPasswordUserUseCase implements ICommandHandler<NewPasswordUserCommand> {
    constructor(
        @Inject() private readonly usersRepository: UserRepository,
        @Inject() private readonly passwordRepository: PasswordRecoveryDbRepository,
    ) {}
    async execute(command: NewPasswordUserCommand) {
        const findCode = await this.passwordRepository.findRecoveryCodeUser(command.recoveryCode);

        if (!findCode) {
            throw NotFoundDomainException.create('произошла непредвиденная ошибка, код не найден', 'code');
        }

        if (findCode.used) {
            throw BadRequestDomainException.create('данный код был уже использован!', 'code');
        }

        const user = await this.usersRepository.findUserByIdOrFail(findCode.userId);
        user.setPasswordAdmin(command.newPassword);
        user.updateEmailConfirmation();
        await this.usersRepository.save(user);

        await this.passwordRepository.updateStatus(findCode._id.toString());
    }
}
