import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../domain/typeorm/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository {
    constructor(@InjectRepository(User) private readonly users: Repository<User>) {}
    async save(entity: User) {
        await this.users.save(entity);
    }
}
