import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserRepository } from '../../../../features/user-accounts/infrastructure/user.repository';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedDomainException } from '../../../exceptions/incubator-exceptions/domain-exceptions';

@Injectable()
export class JwtRefreshAuthPassportStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        @Inject() private readonly usersRepository: UserRepository,
        @Inject() private readonly securityDevicesRepository: any,
        public readonly coreConfig: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                req => {
                    // Extract the JWT from the cookie
                    return req.cookies?.refreshToken; // Ensure that the cookie name matches what you set
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: coreConfig.getOrThrow('refreshTokenSecret'),
        });
    }

    async validate(payload: any) {
        const user = await this.usersRepository.findUserByIdOrFail(payload.userId);
        if (!user) {
            throw UnauthorizedDomainException.create();
        }

        const device = await this.securityDevicesRepository.findDeviceByToken(payload);

        if (!device) {
            throw UnauthorizedDomainException.create();
        }

        return payload;
    }
}
