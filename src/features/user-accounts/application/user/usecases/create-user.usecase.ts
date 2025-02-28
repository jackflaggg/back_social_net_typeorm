import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserCreateDtoService } from '../../../dto/service/user.create.dto';
import { emailConfirmationDataAdmin } from '../../../../../core/utils/user/email-confirmation-data.admin';
import { UserPgRepository } from '../../../infrastructure/postgres/user/user.pg.repository';
import { BcryptService } from '../../bcrypt.service';
import { BadRequestDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { UserCreateDtoRepo } from '../../../dto/repository/user.create.dto';

export class CreateUserCommand {
    constructor(public readonly payload: UserCreateDtoService) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
    constructor(
        private readonly userRepository: UserPgRepository,
        private readonly bcryptService: BcryptService,
    ) {}
    async execute(command: CreateUserCommand) {
        const existingUser = await this.userRepository.findUserByLoginAndEmail(command.payload.login, command.payload.email);
        if (existingUser) {
            throw BadRequestDomainException.create('такой юзер уже существует!', 'login');
        }
        const hashPassword = await this.bcryptService.hashPassword(command.payload.password);

        const userData: UserCreateDtoRepo = {
            ...command.payload,
            password: hashPassword,
            createdAt: new Date(),
        };
        const emailConfirmData = emailConfirmationDataAdmin();
        return await this.userRepository.createUser(userData, emailConfirmData);
    }
}
