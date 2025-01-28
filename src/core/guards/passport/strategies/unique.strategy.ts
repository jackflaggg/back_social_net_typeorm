import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../../../../features/user-accounts/application/auth.service';

@Injectable()
export class UniqueStrategy extends PassportStrategy(Strategy, 'unique') {
    constructor(private readonly authService: AuthService) {
        //поле в теле запроса, которое будет использоваться для валидации
        super({ usernameField: 'login', passwordField: 'password' });
    }

    async validate(login: string, password: string, ...args: any[]) {
        login = login.trim();
        password = password.trim();
        return await this.authService.uniqueUser(login, password);
    }
}
