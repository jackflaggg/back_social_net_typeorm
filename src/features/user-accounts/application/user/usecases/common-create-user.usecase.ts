import { UserCreateDtoService } from '../../../dto/service/user.create.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BcryptService } from '../../other_services/bcrypt.service';
import { Inject } from '@nestjs/common';
import { UserRepositoryOrm } from '../../../infrastructure/typeorm/user/user.orm.repo';
import { emailConfirmationData } from '../../../../../core/utils/user/email-confirmation-data.admin';
import { User } from '../../../domain/typeorm/user/user.entity';
import { EmailConfirmationToUser } from '../../../domain/typeorm/email-confirmation/email.confirmation.entity';

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

        const userDto = {
            login: command.payload.login,
            email: command.payload.email,
            password: hashPassword,
            sentEmailRegistration: false,
        };

        const userAggregationRoot = User.buildInstance(userDto);

        const userId = await this.userRepository.save(userAggregationRoot);

        const emailConfirmDto = emailConfirmationData();

        const emailConfirmationEntity = EmailConfirmationToUser.buildInstance(emailConfirmDto, userId);

        return await this.userRepository.saveEmailConfirmation(emailConfirmationEntity);
    }
}
