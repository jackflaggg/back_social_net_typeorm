import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserDocument } from 'src/features/user-accounts/domain/user/user.entity';
import { UnauthorizedDomainException } from '../../../exceptions/incubator-exceptions/domain-exceptions';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: any) {
        //поле в теле запроса, которое будет использоваться для валидации
        super({ usernameField: 'loginOrEmail' });
    }

    async validate(username: string, password: string): Promise<UserDocument> {
        const user = await this.authService.validateUser({ loginOrEmail: username, password });
        if (!user) {
            throw UnauthorizedDomainException.create();
        }

        return user;
    }
}
