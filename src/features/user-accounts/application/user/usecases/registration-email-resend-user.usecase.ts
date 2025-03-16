import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { BadRequestDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { randomUUID } from 'node:crypto';
import { add } from 'date-fns/add';
import { EmailService } from '../../../../notifications/application/mail.service';
import { UserPgRepository } from '../../../infrastructure/postgres/user/user.pg.repository';
import { UserRepositoryOrm } from '../../../infrastructure/typeorm/user/user.orm.repo';

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
        const user = await this.usersRepository.findUserByLoginOrEmail(command.email);

        if (!user) {
            throw BadRequestDomainException.create('юзера не существует', 'email');
        }

        if (user.isConfirmed) {
            throw BadRequestDomainException.create('аккаунт уже был активирован', 'email');
        }
        const generateCode = randomUUID();

        const newExpirationDate = add(new Date(), {
            hours: 1,
            minutes: 30,
        }).toISOString();

        const newIsConfirmed = false;

        user.updateUserToCodeAndDate(generateCode, newExpirationDate, newIsConfirmed);

        this.mailer.sendEmailRecoveryMessage(user.email, generateCode).catch(async (err: unknown) => {
            console.log(String(err));
        });
    }
}
