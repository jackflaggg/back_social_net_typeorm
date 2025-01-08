import { Module } from '@nestjs/common';
import { UserController } from './api/user.controller';
import { UserService } from './application/user.service';
import { UserRepository } from './infrastructure/user.repository';
import { UserQueryRepository } from './infrastructure/query/user.query.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UserEntity, UserSchema } from './domain/user.entity';

@Module({
    imports: [MongooseModule.forFeature([{ name: UserEntity.name, schema: UserSchema }])],
    providers: [UserService, UserRepository, UserQueryRepository],
    controllers: [UserController],
})
export class UsersModule {}
