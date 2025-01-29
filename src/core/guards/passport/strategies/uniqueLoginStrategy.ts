import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../../../../features/user-accounts/application/auth.service';

@Injectable()
export class UniqueLoginStrategy extends PassportStrategy(Strategy, 'unique-login') {
    constructor(private readonly authService: AuthService) {
        //поле в теле запроса, которое будет использоваться для валидации
        super({ usernameField: 'login', passwordField: 'password' });
    }

    async validate(login: string) {
        login = login.trim();
        return await this.authService.uniqueLoginUser(login);
    }
}

@Injectable()
export class UniqueEmailStrategy extends PassportStrategy(Strategy, 'unique-email') {
    constructor(private readonly authService: AuthService) {
        //поле в теле запроса, которое будет использоваться для валидации
        super({ usernameField: 'email', passwordField: 'password' });
    }

    async validate(email: string) {
        email = email.trim();
        return await this.authService.uniqueEmailUser(email);
    }
}
