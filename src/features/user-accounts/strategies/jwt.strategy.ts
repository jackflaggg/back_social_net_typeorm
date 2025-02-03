import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from '../infrastructure/user/user.repository';
import { UnauthorizedDomainException } from '../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { SETTINGS } from '../../../core/settings';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt-access') {
    constructor(@Inject() private readonly usersRepository: UserRepository) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: SETTINGS.SECRET_KEY,
        });
    }

    async validate(payload: any) {
        const user = await this.usersRepository.findUserByIdOrFail(payload.userId);
        if (!user) {
            throw UnauthorizedDomainException.create();
        }
        return payload;
    }
}
