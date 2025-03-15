import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserCreateDtoService } from '../../../dto/service/user.create.dto';
import { emailConfirmationDataAdmin } from '../../../../../core/utils/user/email-confirmation-data.admin';
import { BcryptService } from '../../other_services/bcrypt.service';
import { BadRequestDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { UserRepositoryOrm } from '../../../infrastructure/typeorm/user/user.orm.repo';
import { User } from '../../../domain/typeorm/user/user.entity';

export class CreateUserCommand {
    constructor(public readonly payload: UserCreateDtoService) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
    constructor(
        private readonly userRepository: UserRepositoryOrm,
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

        const emailConfirmationData = emailConfirmationDataAdmin();

        const userDto = {
            login: command.payload.login,
            email: command.payload.email,
            password: hashPassword,
            sentEmailRegistration: true,
            emailConfirmation: {
                confirmationCode: emailConfirmationData.emailConfirmation.confirmationCode,
                expirationDate: emailConfirmationData.emailConfirmation.expirationDate,
                isConfirmed: emailConfirmationData.emailConfirmation.isConfirmed,
            },
        };

        const userAggregationRoot = User.buildInstance(userDto);

        return await this.userRepository.save(userAggregationRoot);
    }
}
