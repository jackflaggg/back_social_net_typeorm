import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfig } from '../../../core/config/app.config';
import { UserJwtPayloadDto } from './refresh.strategy';
import { UserRepositoryOrm } from '../infrastructure/typeorm/user/user.orm.repo';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt-access') {
    constructor(
        @Inject() private readonly usersRepository: UserRepositoryOrm,
        private readonly coreConfig: AppConfig,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: coreConfig.accessTokenSecret,
        });
    }

    async validate(payload: UserJwtPayloadDto) {
        await this.usersRepository.findUserAuth(payload.userId);
        return payload;
    }
}
