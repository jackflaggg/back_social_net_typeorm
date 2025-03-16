import { UserCreateDtoService } from '../../../dto/service/user.create.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BcryptService } from '../../other_services/bcrypt.service';
import { Inject } from '@nestjs/common';
import { UserRepositoryOrm } from '../../../infrastructure/typeorm/user/user.orm.repo';
import { emailConfirmationData } from '../../../../../core/utils/user/email-confirmation-data.admin';
import { User } from '../../../domain/typeorm/user/user.entity';

export class CommonCreateUserCommand {
    constructor(public readonly payload: UserCreateDtoService) {}
}

@CommandHandler(CommonCreateUserCommand)
export class CommonCreateUserUseCase implements ICommandHandler<CommonCreateUserCommand> {
    constructor(
        @Inject() private readonly userRepository: UserRepositoryOrm,
        private readonly bcryptService: BcryptService,
    ) {}

    async execute(command: CommonCreateUserCommand) {
        const hashPassword = await this.bcryptService.hashPassword(command.payload.password);

        const emailConfirmationUser = emailConfirmationData();

        const userDto = {
            login: command.payload.login,
            email: command.payload.email,
            password: hashPassword,
            sentEmailRegistration: false,
            emailConfirmation: {
                confirmationCode: emailConfirmationUser.emailConfirmation.confirmationCode,
                expirationDate: emailConfirmationUser.emailConfirmation.expirationDate,
                isConfirmed: emailConfirmationUser.emailConfirmation.isConfirmed,
            },
        };

        const userAggregationRoot = User.buildInstance(userDto);

        return await this.userRepository.save(userAggregationRoot);
    }
}
