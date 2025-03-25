import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserCreateDtoService } from '../../../dto/service/user.create.dto';
import { BcryptService } from '../../other_services/bcrypt.service';
import { BadRequestDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { UserRepositoryOrm } from '../../../infrastructure/typeorm/user/user.orm.repo';
import { emailConfirmationDataAdmin } from '../../../utils/user/email-confirmation-data.admin';
import { EmailConfirmationRepositoryOrm } from '../../../infrastructure/typeorm/email-conf/email.orm.conf.repository';

export class CreateUserCommand {
    constructor(public readonly payload: UserCreateDtoService) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
    constructor(
        private readonly userRepository: UserRepositoryOrm,
        private readonly emailConfirmationRepository: EmailConfirmationRepositoryOrm,
        private readonly bcryptService: BcryptService,
    ) {}
    async execute(command: CreateUserCommand) {
        const existingUser = await this.userRepository.findCheckExistUser(command.payload.login, command.payload.email);

        if (existingUser) {
            throw BadRequestDomainException.create(
                'такой юзер уже есть!',
                existingUser.login === command.payload.login ? 'login' : 'email',
            );
        }

        const hashPassword = await this.bcryptService.hashPassword(command.payload.password);

        const userDto = {
            login: command.payload.login,
            email: command.payload.email,
            password: hashPassword,
            sentEmailRegistration: true,
        };

        const userId = await this.userRepository.createUser(userDto);

        const emailConfirmationDto = emailConfirmationDataAdmin();

        await this.emailConfirmationRepository.createEmailConfirmationToUser(emailConfirmationDto, userId);
        return userId;
    }
}
