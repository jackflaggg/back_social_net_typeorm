import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserRepository } from '../infrastructure/user/user.repository';
import { UnauthorizedDomainException } from '../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { SessionRepository } from '../infrastructure/sessions/session.repository';
import { SETTINGS } from '../../../core/settings';

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
            secretOrKey: SETTINGS.SECRET_KEY,
        });
    }

    async validate(payload: UserJwtPayloadDto) {
        const user = await this.usersRepository.findUserByRefreshToken(payload.userId);

        if (!user) {
            throw UnauthorizedDomainException.create();
        }

        const device = await this.securityDevicesRepository.findDeviceById(payload.deviceId);

        if (!device) {
            throw UnauthorizedDomainException.create();
        }

        if (device.issuedAt.toISOString() !== new Date(+payload.iat * 1000).toISOString()) {
            throw UnauthorizedDomainException.create();
        }
        return payload;
    }
}
