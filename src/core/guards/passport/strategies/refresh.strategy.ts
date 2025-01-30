import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserRepository } from '../../../../features/user-accounts/infrastructure/user/user.repository';
import { UnauthorizedDomainException } from '../../../exceptions/incubator-exceptions/domain-exceptions';
import { SessionRepository } from '../../../../features/user-accounts/infrastructure/sessions/session.repository';

export class UserJwtPayloadDto {
    userId: string;
    deviceId: string;
    iat: number;
    exp: number;
}

@Injectable()
export class JwtRefreshAuthPassportStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        @Inject() private readonly usersRepository: UserRepository,
        @Inject() private readonly securityDevicesRepository: SessionRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                req => {
                    // Extract the JWT from the cookie
                    return req.cookies?.refreshToken; // Ensure that the cookie name matches what you set
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: 'envelope',
        });
    }

    async validate(payload: UserJwtPayloadDto) {
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
