import { UnauthorizedDomainException } from '../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { Inject, Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { findUserByLoginOrEmailInterface } from '../../dto/api/user.in.jwt.find.dto';
import { UserRepositoryOrm } from '../../infrastructure/typeorm/user/user.orm.repo';

@Injectable()
export class AuthService {
    constructor(@Inject() private readonly usersRepository: UserRepositoryOrm) {}

    async validateUser(userName: string, password: string): Promise<findUserByLoginOrEmailInterface> {
        const user = await this.usersRepository.findUserByLoginOrEmail(userName);
        if (!user) {
            throw UnauthorizedDomainException.create();
        }

        const comparePassword: boolean = await compare(password, user.password);

        if (!comparePassword) {
            throw UnauthorizedDomainException.create();
        }

        return user as findUserByLoginOrEmailInterface;
    }
}
