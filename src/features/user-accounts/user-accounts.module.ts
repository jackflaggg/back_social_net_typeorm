import { Module } from '@nestjs/common';
import { UserController } from './api/user.controller';
import { UserService } from './application/user/user.service';
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

const usersProviders = [
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
];

@Module({
    imports: [MongooseModule.forFeature([{ name: UserEntity.name, schema: UserSchema }]), CqrsModule],
    providers: [...usersProviders],
    controllers: [UserController, AuthController],
})
export class UsersModule {}
