import { UserRepository } from '../infrastructure/user.repository';
import { InjectModel } from '@nestjs/mongoose';
import { UserEntity, UserModelType } from '../domain/user.entity';
import { UserCreateDtoService } from '../dto/service/user.create.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

export class UserService {
    constructor(
        @InjectModel(UserEntity.name) private userModel: UserModelType,
        private readonly userRepository: UserRepository,
    ) {}

    async createUser(dto: UserCreateDtoService) {
        let user = this.userModel.buildInstance(dto);
        user = await user.setPassword(dto.password);
        await this.userRepository.save(user);
        return user._id.toString();
    }
    async deleteUser(id: string) {
        const user = await this.userRepository.findUserById(id);

        if (!user) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }

        user.makeDeleted();

        await this.userRepository.save(user);
    }
}
