import { Module } from '@nestjs/common';
import { UserController } from './api/user.controller';
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
import { UniqueEmailStrategy, UniqueLoginStrategy } from './strategies/uniqueLoginStrategy';
import { RegistrationUserUseCase } from './application/user/usecases/registration-user.usecase';
import { EmailService } from '../notifications/application/mail.service';
import { CommonCreateUserUseCase } from './application/user/usecases/common-create-user.usecase';
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
import { JwtRefreshAuthPassportStrategy } from './strategies/refresh.strategy';
import { DeleteSessionsUseCase } from './application/device/usecases/delete-sessions.usecase';
import { UpdateSessionUseCase } from './application/device/usecases/update-session.usecase';
import { CoreConfig } from '../../core/config/core.config';
import { ConfigModule } from '@nestjs/config';
import { EmailAdapter } from '../notifications/adapter/email.adapter';
import { PasswordRecoveryDbRepository } from './infrastructure/mongoose/password/password.recovery.repository';
import { SessionQueryRepository } from './infrastructure/mongoose/sessions/query/session.query.repository';
import { UserQueryRepository } from './infrastructure/mongoose/user/query/user.query.repository';
import { UserRepository } from './infrastructure/mongoose/user/user.repository';
import { SessionRepository } from './infrastructure/mongoose/sessions/session.repository';
import { UserPgRepository } from './infrastructure/postgres/user/user.pg.repository';
import { BcryptService } from './application/bcrypt.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/typeorm/user/user.entity';
import { EmailConfirmation } from './domain/typeorm/user/email.confirmation.entity';
import { RecoveryPassword } from './domain/typeorm/password-recovery/pass-rec.entity';
import { SecurityDevice } from './domain/typeorm/device/device.entity';
import { UserPgQueryRepository } from './infrastructure/postgres/user/query/user.pg.query.repository';

const useCases = [
    // CreateSessionUseCase,
    // ValidateUserUseCase,
    // LoginUserUseCase,
    CreateUserUseCase,
    DeleteUserUseCase,
    // RegistrationUserUseCase,
    // CommonCreateUserUseCase,
    // RegistrationConfirmationUserUseCase,
    // PasswordRecoveryUserUseCase,
    // RegistrationEmailResendUserUseCase,
    // DeleteSessionUseCase,
    // NewPasswordUserUseCase,
    // RefreshTokenUserUseCase,
    // LogoutUserUseCase,
    // DeleteSessionsUseCase,
    // UpdateSessionUseCase,
];
// const repositoriesMongoose = [UserRepository, UserQueryRepository, SessionRepository, PasswordRecoveryDbRepository, SessionQueryRepository];
const repositoriesPostgres = [UserPgRepository, UserPgQueryRepository];
const strategies = [
    BasicStrategy,
    // LocalStrategy,
    // UniqueLoginStrategy,
    // UniqueEmailStrategy,
    // AccessTokenStrategy,
    // JwtRefreshAuthPassportStrategy,
];
const services = [/*AuthService, */ JwtService, EmailService, EmailAdapter, BcryptService];
const handlers = [UserLoggedInEventHandler];

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
    controllers: [UserController /*, AuthController, SessionController*/],
})
export class UsersModule {}
