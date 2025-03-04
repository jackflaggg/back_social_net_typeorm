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
import { AuthService } from './application/auth.service';
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
import { CoreConfig } from '../../core/config/core.config';
import { ConfigModule } from '@nestjs/config';
import { EmailAdapter } from '../notifications/adapter/email.adapter';
import { UserPgRepository } from './infrastructure/postgres/user/user.pg.repository';
import { BcryptService } from './application/bcrypt.service';
import { UserPgQueryRepository } from './infrastructure/postgres/user/query/user.pg.query.repository';
import { SessionsPgRepository } from './infrastructure/postgres/sessions/sessions.pg.repository';
import { SessionQueryPgRepository } from './infrastructure/postgres/sessions/query/sessions.pg.query.repository';
import { PasswordRecoveryPgRepository } from './infrastructure/postgres/password/password.pg.recovery.repository';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserLoggedInEventHandler } from './event-bus/auth/user.logged.event';
import { UserRegistrationEventHandler } from './event-bus/auth/user.registration.event';

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

const repositoriesPostgres = [
    UserPgRepository,
    UserPgQueryRepository,
    SessionsPgRepository,
    SessionQueryPgRepository,
    PasswordRecoveryPgRepository,
];

const strategies = [BasicStrategy, LocalStrategy, AccessTokenStrategy, JwtRefreshAuthPassportStrategy];
const services = [AuthService, JwtService, EmailService, EmailAdapter, BcryptService];
const handlers = [UserLoggedInEventHandler, UserRegistrationEventHandler];

@Module({
    imports: [
        // Вы можете игнорировать expiresIn: '5m' в JwtModule.register(),
        // так как в вашей логике этот параметр переопределяется.
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [CoreConfig],
            useFactory: async (coreConfig: CoreConfig) => ({
                secret: coreConfig.accessTokenSecret,
                signOptions: { expiresIn: coreConfig.accessTokenExpirationTime },
            }),
        }),
        PassportModule,
        //если в системе несколько токенов (например, access и refresh) с разными опциями (время жизни, секрет)
        //можно переопределить опции при вызове метода jwt.service.sign
        //или написать свой tokens сервис (адаптер), где эти опции будут уже учтены
        CqrsModule,
    ],
    exports: [UserPgRepository],
    providers: [...useCases, ...services, ...strategies, ...handlers, ...repositoriesPostgres],
    controllers: [UserSaController, AuthController, SessionController],
})
export class UsersModule {}
