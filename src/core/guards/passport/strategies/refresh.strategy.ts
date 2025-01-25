import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { Strategy } from 'passport';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        @Inject(refreshConfig.KEY) private readonly refreshConfiguration: ConfigType<typeof refreshConfig>,
        private readonly authService: AuthService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: refreshConfiguration.secret,
            // для того, чтоб передать реквест
            passReqToCallback: true,
        });
    }
    /**
     * функция принимает payload из токена и возвращает то, что будет записано в req.user
     * @param payload
     */
    async validate(req: Request, payload: AuthJWTPayload) {
        // в пэйлоуд будут лежать раскодированные данные!!!!!
        console.log(payload, req.headers.authorization);
        const refreshToken = req.get('authorization').replace('Bearer', '').trim();
        const userId = payload.sub;
        return await this.authService.validateRefreshToken(userId, refreshToken);
    }
}
