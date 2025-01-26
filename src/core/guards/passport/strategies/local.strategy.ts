import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserDocument } from 'src/features/user-accounts/domain/user/user.entity';
import { UnauthorizedDomainException } from '../../../exceptions/incubator-exceptions/domain-exceptions';
import { AuthService } from '../../../../features/user-accounts/application/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(private readonly authService: AuthService) {
        //поле в теле запроса, которое будет использоваться для валидации
        super({ usernameField: 'loginOrEmail' });
    }

    async validate(username: string, password: string): Promise<UserDocument> {
        username = username.trim();
        const user = await this.authService.validateUser(username);
        if (!user) {
            throw UnauthorizedDomainException.create();
        }

        return user;
    }
}
