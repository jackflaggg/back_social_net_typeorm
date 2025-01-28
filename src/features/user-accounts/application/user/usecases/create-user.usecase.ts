import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { UserEntity, UserModelType } from '../../../domain/user/user.entity';
import { UserRepository } from '../../../infrastructure/user/user.repository';
import { UserCreateDtoService } from '../../../dto/service/user.create.dto';
import { emailConfirmationData } from '../../../../../core/utils/user/email-confirmation.data';

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
            ...emailConfirmationData(),
        };
        const user = this.userModel.buildInstance(extensionDto);
        await user.setPasswordAdmin(command.payload.password);
        await this.userRepository.save(user);
        return user._id.toString();
    }
}
