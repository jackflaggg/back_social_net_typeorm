import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from '../../../../features/user-accounts/infrastructure/user.repository';
import { configSchema } from '../../../config/app-config/core.config.schema';
import { getJWTConfig } from '../../../config/jwt/jwt.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-access') {
    constructor(
        @Inject() private readonly usersRepository: UserRepository,
        private readonly coreConfig: typeof configSchema,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: getJWTConfig(),
        });
    }
    /**
     * функция принимает payload из jwt токена и возвращает то, что будет записано в req.user
     * @param payload
     */
    validate(payload: any) {
        // в пэйлоуд будут лежать раскодированные данные!!!!!
        return { id: payload.sub };
    }
}
