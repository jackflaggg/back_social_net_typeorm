import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../../domain/typeorm/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserOrmRepository {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}
    async save(user: any){

    }
}
