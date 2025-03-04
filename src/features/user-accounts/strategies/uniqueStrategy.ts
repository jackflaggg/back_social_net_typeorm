import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../application/auth.service';

@Injectable()
export class UniqueStrategy extends PassportStrategy(Strategy, 'unique-user') {
    constructor(private readonly authService: AuthService) {
        //поле в теле запроса, которое будет использоваться для валидации
        super({ usernameField: 'login', passwordField: 'password' });
    }

    async validate(login: string) {
        /* function verified(err, user, info) {
            if (err) { return self.error(err); }
            if (!user) { return self.fail(info); }
            self.success(user, info);
        } */

        login = login.trim();

        // Проверяем уникальность логина
        return await this.authService.uniqueUser(login);
    }
}
