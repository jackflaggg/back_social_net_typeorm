import { UserRepository } from '../../infrastructure/user/user.repository';
import { InjectModel } from '@nestjs/mongoose';
import { UserEntity, UserModelType } from '../../domain/user/user.entity';
import { UserCreateDtoService } from '../../dto/service/user.create.dto';
import { LoginDtoService } from '../../dto/service/login.dto';
import { PasswordRecoveryDtoService } from '../../dto/service/password-recovery.dto';
import { NewPasswordDtoService } from '../../dto/service/new-password.dto';
import { RegistrationDtoService } from '../../dto/service/registration.dto';
import { RegistrationConfirmationDtoService } from '../../dto/service/registration-confirmation.dto';
import { RegistrationEmailResendingDtoService } from '../../dto/service/registration-email-resending.dto';
import { emailConfirmationData } from '../../../../core/utils/user/email-confirmation.data';

export class UserService {
    constructor(
        @InjectModel(UserEntity.name) private userModel: UserModelType,
        private readonly userRepository: UserRepository,
    ) {}

    async createUser(dto: UserCreateDtoService) {
        const extensionDto = {
            ...dto,
            ...emailConfirmationData(),
        };

        const user = this.userModel.buildInstance(extensionDto);
        await user.setPassword(dto.password);
        await this.userRepository.save(user);
        return user._id.toString();
    }
    async deleteUser(id: string) {
        const user = await this.userRepository.findUserByIdOrFail(id);

        user.makeDeleted();

        await this.userRepository.save(user);
    }
    async login(dto: LoginDtoService) {
        return dto;
    }

    async passwordRecovery(dto: PasswordRecoveryDtoService) {
        return dto;
    }

    async newPassword(dto: NewPasswordDtoService) {
        return dto;
    }

    async registration(dto: RegistrationDtoService) {
        return dto;
    }

    async registrationConfirmation(dto: RegistrationConfirmationDtoService) {
        return dto;
    }

    async emailResend(dto: RegistrationEmailResendingDtoService) {
        return dto;
    }
}
