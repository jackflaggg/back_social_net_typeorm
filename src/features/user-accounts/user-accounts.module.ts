import { Module } from '@nestjs/common';
import { UserSaController } from './api/user.sa.controller';
import { AuthController } from './api/auth.controller';
import { BasicStrategy } from './strategies/basic.strategy';
import { CreateUserUseCase } from './application/user/usecases/create-user.usecase';
import { DeleteUserUseCase } from './application/user/usecases/delete-user.usecase';
import { CqrsModule } from '@nestjs/cqrs';
import { LocalStrategy } from './strategies/local.strategy';
import { ValidateUserUseCase } from './application/user/usecases/validate-user.usecase';
import { LoginUserUseCase } from './application/user/usecases/login-user.usecase';
import { AuthService } from './application/other_services/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { CreateSessionUseCase } from './application/device/usecases/create-session.usecase';
import { RegistrationUserUseCase } from './application/user/usecases/registration-user.usecase';
import { EmailService } from '../notifications/application/mail.service';
import { CommonCreateUserUseCase } from './application/user/usecases/common-create-user.usecase';
import { RegistrationConfirmationUserUseCase } from './application/user/usecases/registration-confirmation-user.usecase';
import { PasswordRecoveryUserUseCase } from './application/user/usecases/password-recovery-user.usecase';
import { AccessTokenStrategy } from './strategies/jwt.strategy';
import { RegistrationEmailResendUserUseCase } from './application/user/usecases/registration-email-resend-user.usecase';
import { DeleteSessionUseCase } from './application/device/usecases/delete-session.usecase';
import { NewPasswordUserUseCase } from './application/user/usecases/new-password-user.usecase';
import { RefreshTokenUserUseCase } from './application/user/usecases/refresh-token.user.usecase';
import { LogoutUserUseCase } from './application/user/usecases/logout-user.usecase';
import { SessionController } from './api/session.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtRefreshAuthPassportStrategy } from './strategies/refresh.strategy';
import { DeleteSessionsUseCase } from './application/device/usecases/delete-sessions.usecase';
import { AppConfig } from '../../core/config/app.config';
import { ConfigModule } from '@nestjs/config';
import { EmailAdapter } from '../notifications/adapter/email.adapter';
import { UserPgRepository } from './infrastructure/postgres/user/user.pg.repository';
import { BcryptService } from './application/other_services/bcrypt.service';
import { LogUserInformationWhenUserLoggedInEventHandler } from './application/user/event-handlers/logUserInformationWhenUserLoggedInEventHandler';
import { SecurityDeviceToUser } from './domain/typeorm/device/device.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/typeorm/user/user.entity';
import { EmailConfirmationToUser } from './domain/typeorm/email-confirmation/email.confirmation.entity';
import { RecoveryPasswordToUser } from './domain/typeorm/password-recovery/pass-rec.entity';
import { EmailRetryService } from '../notifications/application/mail.retry.service';
import { EmailScheduler } from '../notifications/scheduler/email.scheduler';
import { UserRepositoryOrm } from './infrastructure/typeorm/user/user.orm.repo';
import { UserQueryRepositoryOrm } from './infrastructure/typeorm/user/query/user.query.orm.repo';
import { SessionsRepositoryOrm } from './infrastructure/typeorm/sessions/sessions.orm.repository';
import { SessionQueryRepositoryOrm } from './infrastructure/typeorm/sessions/query/sessions.orm.query.repository';
import { PasswordRecoveryRepositoryOrm } from './infrastructure/typeorm/password/password.orm.recovery.repository';

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
];

const repositories = [
    UserRepositoryOrm,
    UserQueryRepositoryOrm,
    UserPgRepository,
    SessionsRepositoryOrm,
    SessionQueryRepositoryOrm,
    PasswordRecoveryRepositoryOrm,
];

const strategies = [BasicStrategy, LocalStrategy, AccessTokenStrategy, JwtRefreshAuthPassportStrategy];
const services = [AuthService, JwtService, EmailService, EmailAdapter, BcryptService, EmailRetryService, EmailScheduler];
const handlers = [LogUserInformationWhenUserLoggedInEventHandler];

@Module({
    imports: [
        // Вы можете игнорировать expiresIn: '5m' в JwtModule.register(),
        // так как в вашей логике этот параметр переопределяется!
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [AppConfig],
            useFactory: async (coreConfig: AppConfig) => ({
                secret: coreConfig.accessTokenSecret,
                signOptions: { expiresIn: coreConfig.accessTokenExpirationTime },
            }),
        }),
        TypeOrmModule.forFeature([User, EmailConfirmationToUser, SecurityDeviceToUser, RecoveryPasswordToUser]),
        PassportModule,
        //если в системе несколько токенов (например, access и refresh) с разными опциями (время жизни, секрет)
        //можно переопределить опции при вызове метода jwt.service.sign
        //или написать свой tokens сервис (адаптер), где эти опции будут уже учтены
        // и тд!
        CqrsModule,
    ],
    exports: [UserPgRepository],
    providers: [...useCases, ...services, ...strategies, ...handlers, ...repositories],
    controllers: [UserSaController, AuthController, SessionController],
})
export class UsersModule {}
