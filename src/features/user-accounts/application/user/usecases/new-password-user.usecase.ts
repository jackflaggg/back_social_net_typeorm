import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestDomainException, NotFoundDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { BcryptService } from '../../other_services/bcrypt.service';
import { UserRepositoryOrm } from '../../../infrastructure/typeorm/user/user.orm.repo';
import { PasswordRecoveryRepositoryOrm } from '../../../infrastructure/typeorm/password/password.orm.recovery.repository';

export class NewPasswordUserCommand {
    constructor(
        public readonly newPassword: string,
        public readonly recoveryCode: string,
    ) {}
}

@CommandHandler(NewPasswordUserCommand)
export class NewPasswordUserUseCase implements ICommandHandler<NewPasswordUserCommand> {
    constructor(
        private readonly usersRepository: UserRepositoryOrm,
        private readonly passwordRepository: PasswordRecoveryRepositoryOrm,
        private readonly bcryptService: BcryptService,
    ) {}
    async execute(command: NewPasswordUserCommand): Promise<void> {
        const findCode = await this.passwordRepository.findCode(command.recoveryCode);

        if (!findCode) {
            throw NotFoundDomainException.create('произошла непредвиденная ошибка, код не найден', 'code');
        }

        if (findCode.used) {
            throw BadRequestDomainException.create('данный код был уже использован!', 'code');
        }

        const user = await this.usersRepository.findUserById(findCode['user_id']);

        const newPasswordHash = await this.bcryptService.hashPassword(user.passwordHash);

        await this.usersRepository.updateUserPassword(user, newPasswordHash);

        await this.passwordRepository.updateRecoveryPassword(findCode);
    }
}
