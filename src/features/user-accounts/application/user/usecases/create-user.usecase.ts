import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { UserEntity, UserModelType } from '../../../domain/user/user.entity';
import { UserCreateDtoService } from '../../../dto/service/user.create.dto';
import { emailConfirmationDataAdmin } from '../../../../../core/utils/user/email-confirmation-data.admin';
import { UserRepository } from '../../../infrastructure/mongoose/user/user.repository';

export class CreateUserCommand {
    constructor(public readonly payload: UserCreateDtoService) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
    constructor(
        private readonly userRepository: UserRepository,
        @InjectModel(UserEntity.name) private userModel: UserModelType,
    ) {}
    async execute(command: CreateUserCommand) {
        const extensionDto = {
            ...command.payload,
            ...emailConfirmationDataAdmin(),
        };
        const user = this.userModel.buildInstance(extensionDto);
        await user.setPasswordAdmin(command.payload.password);
        await this.userRepository.save(user);
        return user._id.toString();
    }
}
