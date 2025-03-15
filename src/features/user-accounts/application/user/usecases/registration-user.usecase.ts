import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { EmailService } from '../../../../notifications/application/mail.service';
import { CommonCreateUserCommand } from './common-create-user.usecase';
import { UserPgRepository } from '../../../infrastructure/postgres/user/user.pg.repository';
import { AuthRegistrationDtoApi } from '../../../dto/api/auth.registration.dto';
import { BadRequestDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { UserRepositoryOrm } from '../../../infrastructure/typeorm/user/user.orm.repo';

export class RegistrationUserCommand {
    constructor(public readonly payload: AuthRegistrationDtoApi) {}
}

@CommandHandler(RegistrationUserCommand)
export class RegistrationUserUseCase implements ICommandHandler<RegistrationUserCommand> {
    constructor(
        @Inject() private readonly userRepository: UserRepositoryOrm,
        private readonly commandBus: CommandBus,
        private readonly mailer: EmailService,
    ) {}
    async execute(command: RegistrationUserCommand) {
        const existingUser = await this.userRepository.findUserByLoginAndEmail(command.payload.login, command.payload.email);

        if (existingUser) {
            throw BadRequestDomainException.create('такой юзер уже существует!', 'login');
        }

        const userId = await this.commandBus.execute<CommonCreateUserCommand, string>(new CommonCreateUserCommand(command.payload));

        const user = await this.userRepository.findUserById(userId);

        this.mailer.sendEmailRecoveryMessage(command.payload.email, user.confirmationCode).catch((err: unknown) => {
            // здесь нужно будет обновлять поле sentEmailRegistration!
            console.log(err);
        });
    }
}
