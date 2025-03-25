import { UnauthorizedDomainException } from '../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { Injectable } from '@nestjs/common';
import { findUserByLoginOrEmailInterface } from '../../dto/api/user.in.jwt.find.dto';
import { UserRepositoryOrm } from '../../infrastructure/typeorm/user/user.orm.repo';
import { BcryptService } from './bcrypt.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersRepository: UserRepositoryOrm,
        private bcryptService: BcryptService,
    ) {}

    async validateUser(userName: string, password: string): Promise<findUserByLoginOrEmailInterface> {
        const user = await this.usersRepository.findUserByLoginOrEmail(userName);

        if (!user) {
            throw UnauthorizedDomainException.create();
        }

        const comparePassword: boolean = await this.bcryptService.comparePassword(password, user.password);

        if (!comparePassword) {
            throw UnauthorizedDomainException.create();
        }

        return user as findUserByLoginOrEmailInterface;
    }
}
