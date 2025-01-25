import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from '../../../../features/user-accounts/infrastructure/user.repository';
import { UnauthorizedDomainException } from '../../../exceptions/incubator-exceptions/domain-exceptions';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'accessToken') {
    constructor(
        private readonly configService: ConfigService,
        @Inject() private readonly usersRepository: UserRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow('ACCESS_TOKEN_JWT_SECRET'),
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
