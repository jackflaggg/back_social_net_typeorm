import { Module } from '@nestjs/common';
import { UserController } from './api/user.controller';
import { UserRepository } from './infrastructure/user/user.repository';
import { UserQueryRepository } from './infrastructure/user/query/user.query.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UserEntity, UserSchema } from './domain/user/user.entity';
import { AuthController } from './api/auth.controller';
import { BasicStrategy } from './strategies/basic.strategy';
import { CreateUserUseCase } from './application/user/usecases/create-user.usecase';
import { DeleteUserUseCase } from './application/user/usecases/delete-user.usecase';
import { CqrsModule } from '@nestjs/cqrs';
import { LocalStrategy } from './strategies/local.strategy';
import { ValidateUserUseCase } from './application/user/usecases/validate-user.usecase';
import { LoginUserUseCase } from './application/user/usecases/login-user.usecase';
import { AuthService, UserLoggedInEventHandler } from './application/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { CreateSessionUseCase } from './application/device/usecases/create-session.usecase';
import { DeviceEntity, DeviceSchema } from './domain/device/device.entity';
import { SessionRepository } from './infrastructure/sessions/session.repository';
import { UniqueEmailStrategy, UniqueLoginStrategy } from './strategies/uniqueLoginStrategy';
import { RegistrationUserUseCase } from './application/user/usecases/registration-user.usecase';
import { EmailService } from '../notifications/application/mail.service';
import { CommonCreateUserUseCase } from './application/user/usecases/common-create-user.usecase';
import { PasswordRecoveryDbRepository } from './infrastructure/password/password.recovery.repository';
import { RegistrationConfirmationUserUseCase } from './application/user/usecases/registration-confirmation-user.usecase';
import { PasswordRecoveryEntity, PasswordRecoverySchema } from './domain/password-recovery/password-recovery.entity';
import { PasswordRecoveryUserUseCase } from './application/user/usecases/password-recovery-user.usecase';
import { AccessTokenStrategy } from './strategies/jwt.strategy';
import { RegistrationEmailResendUserUseCase } from './application/user/usecases/registration-email-resend-user.usecase';
import { DeleteSessionUseCase } from './application/device/usecases/delete-session.usecase';
import { NewPasswordUserUseCase } from './application/user/usecases/new-password-user.usecase';
import { RefreshTokenUserUseCase } from './application/user/usecases/refresh-token.user.usecase';
import { LogoutUserUseCase } from './application/user/usecases/logout-user.usecase';
import { SessionController } from './api/session.controller';
import { PassportModule } from '@nestjs/passport';
import { SessionQueryRepository } from './infrastructure/sessions/query/session.query.repository';
import { JwtRefreshAuthPassportStrategy } from './strategies/refresh.strategy';
import { DeleteSessionsUseCase } from './application/device/usecases/delete-sessions.usecase';
import { UpdateSessionUseCase } from './application/device/usecases/update-session.usecase';
import { SETTINGS } from '../../core/settings';

const useCases = [
    CreateSessionUseCase,
    ValidateUserUseCase,
    LoginUserUseCase,
    CreateUserUseCase,
    DeleteUserUseCase,
    RegistrationUserUseCase,
    CommonCreateUserUseCase,
    RegistrationConfirmationUserUseCase,
    PasswordRecoveryUserUseCase,
    RegistrationEmailResendUserUseCase,
    DeleteSessionUseCase,
    NewPasswordUserUseCase,
    RefreshTokenUserUseCase,
    LogoutUserUseCase,
    DeleteSessionsUseCase,
    UpdateSessionUseCase,
];
const repositories = [UserRepository, UserQueryRepository, SessionRepository, PasswordRecoveryDbRepository, SessionQueryRepository];
const strategies = [
    BasicStrategy,
    LocalStrategy,
    UniqueLoginStrategy,
    UniqueEmailStrategy,
    AccessTokenStrategy,
    JwtRefreshAuthPassportStrategy,
];
const services = [AuthService, JwtService, EmailService];
const handlers = [UserLoggedInEventHandler];

@Module({
    imports: [
        // Вы можете игнорировать expiresIn: '5m' в JwtModule.register(), так как в вашей логике этот параметр переопределяется.
        JwtModule.register({
            secret: SETTINGS.SECRET_KEY,
            signOptions: { expiresIn: '5m' },
        }),
        PassportModule,
        //если в системе несколько токенов (например, access и refresh) с разными опциями (время жизни, секрет)
        //можно переопределить опции при вызове метода jwt.service.sign
        //или написать свой tokens сервис (адаптер), где эти опции будут уже учтены
        MongooseModule.forFeature([
            { name: UserEntity.name, schema: UserSchema },
            { name: DeviceEntity.name, schema: DeviceSchema },
            { name: PasswordRecoveryEntity.name, schema: PasswordRecoverySchema },
        ]),
        CqrsModule,
    ],
    exports: [UserRepository],
    providers: [...useCases, ...repositories, ...services, ...strategies, ...handlers],
    controllers: [UserController, AuthController, SessionController],
})
export class UsersModule {}
