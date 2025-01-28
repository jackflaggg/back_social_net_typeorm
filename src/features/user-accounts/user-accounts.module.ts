import { Module } from '@nestjs/common';
import { UserController } from './api/user.controller';
import { UserRepository } from './infrastructure/user/user.repository';
import { UserQueryRepository } from './infrastructure/user/query/user.query.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UserEntity, UserSchema } from './domain/user/user.entity';
import { AuthController } from './api/auth.controller';
import { BasicStrategy } from '../../core/guards/passport/strategies/basic.strategy';
import { CreateUserUseCase } from './application/user/usecases/create-user.usecase';
import { DeleteUserUseCase } from './application/user/usecases/delete-user.usecase';
import { CqrsModule } from '@nestjs/cqrs';
import { LocalStrategy } from '../../core/guards/passport/strategies/local.strategy';
import { ValidateUserUseCase } from './application/user/usecases/validate-user.usecase';
import { LoginUserUseCase } from './application/user/usecases/login-user.usecase';
import { AuthService, UserLoggedInEventHandler } from './application/auth.service';
import { JwtService } from '@nestjs/jwt';
import { CreateSessionUseCase } from './application/device/usecases/create-session.usecase';
import { DeviceEntity, DeviceSchema } from './domain/device/device.entity';
import { SessionRepository } from './infrastructure/sessions/session.repository';
import { UniqueStrategy } from '../../core/guards/passport/strategies/unique.strategy';

const usersProviders = [
    CreateSessionUseCase,
    AuthService,
    UserLoggedInEventHandler,
    UserRepository,
    UserQueryRepository,
    BasicStrategy,
    ValidateUserUseCase,
    LoginUserUseCase,
    LocalStrategy,
    CreateUserUseCase,
    DeleteUserUseCase,
    JwtService,
    SessionRepository,
    UniqueStrategy,
];

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: UserEntity.name, schema: UserSchema },
            { name: DeviceEntity.name, schema: DeviceSchema },
        ]),
        CqrsModule,
    ],
    providers: [...usersProviders],
    controllers: [UserController, AuthController],
})
export class UsersModule {}
