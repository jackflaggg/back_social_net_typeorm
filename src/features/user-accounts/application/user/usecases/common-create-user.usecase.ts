import { UserCreateDtoService } from '../../../dto/service/user.create.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { UserEntity, UserModelType } from '../../../domain/user/user.entity';
import { emailConfirmationData } from '../../../../../core/utils/user/email-confirmation-data.admin';
import { UserRepository } from '../../../infrastructure/mongoose/user/user.repository';

export class CommonCreateUserCommand {
    constructor(public readonly payload: UserCreateDtoService) {}
}

@CommandHandler(CommonCreateUserCommand)
export class CommonCreateUserUseCase implements ICommandHandler<CommonCreateUserCommand> {
    constructor(
        private readonly userRepository: UserRepository,
        @InjectModel(UserEntity.name) private userModel: UserModelType,
    ) {}
    async execute(command: CommonCreateUserCommand) {
        const extensionDto = {
            ...command.payload,
            ...emailConfirmationData(),
        };
        const user = this.userModel.buildInstance(extensionDto);
        await user.setPasswordAdmin(command.payload.password);
        await this.userRepository.save(user);
        return user._id.toString();
    }
}
