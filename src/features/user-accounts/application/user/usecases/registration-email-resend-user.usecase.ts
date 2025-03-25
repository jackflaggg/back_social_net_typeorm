import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { BadRequestDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { EmailService } from '../../../../notifications/application/mail.service';
import { UserRepositoryOrm } from '../../../infrastructure/typeorm/user/user.orm.repo';
import { emailConfirmationData } from '../../../utils/user/email-confirmation-data.admin';

export class RegistrationEmailResendUserCommand {
    constructor(public readonly email: string) {}
}

@CommandHandler(RegistrationEmailResendUserCommand)
export class RegistrationEmailResendUserUseCase implements ICommandHandler<RegistrationEmailResendUserCommand> {
    constructor(
        @Inject() private readonly usersRepository: UserRepositoryOrm,
        private readonly mailer: EmailService,
    ) {}
    async execute(command: RegistrationEmailResendUserCommand) {
        const user = await this.usersRepository.findUserByEmailRaw(command.email);

        if (!user) {
            throw BadRequestDomainException.create('юзера не существует', 'email');
        }

        if (user.isConfirmed) {
            throw BadRequestDomainException.create('аккаунт уже был активирован', 'email');
        }

        const emailConfirmation = await this.usersRepository.findEmailConfirmation(user.id);

        if (!emailConfirmation) {
            throw BadRequestDomainException.create('произошла неожиданная ошибка 🥶', 'emailConfirmation');
        }

        const emailConfirmDto = emailConfirmationData();

        emailConfirmation.updateUserToCodeAndDate(emailConfirmDto);

        await this.usersRepository.saveEmailConfirmation(emailConfirmation);

        this.mailer.sendEmailRecoveryMessage(user.email, emailConfirmDto.confirmationCode).catch(async (err: unknown) => {
            console.log(String(err));
        });
    }
}
