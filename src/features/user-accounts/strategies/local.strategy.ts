import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { findUserByLoginOrEmailInterface } from '../dto/api/user.in.jwt.find.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(private readonly authService: AuthService) {
        //поле в теле запроса, которое будет использоваться для валидации
        super({ usernameField: 'loginOrEmail' });
    }

    async validate(username: string, password: string): Promise<findUserByLoginOrEmailInterface> {
        username = username.trim();
        password = password.trim();
        return await this.authService.validateUser(username, password);
    }
}
