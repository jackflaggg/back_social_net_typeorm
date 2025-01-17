import { Module } from '@nestjs/common';
import { UserController } from './api/user.controller';
import { UserService } from './application/user.service';
import { UserRepository } from './infrastructure/user.repository';
import { UserQueryRepository } from './infrastructure/query/user.query.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UserEntity, UserSchema } from './domain/user/user.entity';
import { AuthController } from './api/auth.controller';

const usersProviders = [UserService, UserRepository, UserQueryRepository];

@Module({
    imports: [MongooseModule.forFeature([{ name: UserEntity.name, schema: UserSchema }])],
    providers: [...usersProviders],
    controllers: [UserController, AuthController],
})
export class UsersModule {}
