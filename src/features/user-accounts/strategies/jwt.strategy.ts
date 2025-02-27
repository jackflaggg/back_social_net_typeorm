import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CoreConfig } from '../../../core/config/core.config';
import { UserPgRepository } from '../infrastructure/postgres/user/user.pg.repository';
import { UserJwtPayloadDto } from './refresh.strategy';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt-access') {
    constructor(
        @Inject() private readonly usersRepository: UserPgRepository,
        private readonly coreConfig: CoreConfig,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: coreConfig.accessTokenSecret,
        });
    }

    async validate(payload: UserJwtPayloadDto) {
        return await this.usersRepository.findUserAuth(payload.userId);
    }
}
