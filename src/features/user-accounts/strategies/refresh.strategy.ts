import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UnauthorizedDomainException } from '../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { AppConfig } from '../../../core/config/app.config';
import { UserRepositoryOrm } from '../infrastructure/typeorm/user/user.orm.repo';
import { SessionsRepositoryOrm } from '../infrastructure/typeorm/sessions/sessions.orm.repository';

export class UserJwtPayloadDto {
    userId: string;
    deviceId: string;
    iat: number;
    exp: number;
}

@Injectable()
export class JwtRefreshAuthPassportStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        @Inject() private readonly usersRepository: UserRepositoryOrm,
        @Inject() private readonly securityDevicesRepository: SessionsRepositoryOrm,
        private readonly coreConfig: AppConfig,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                req => {
                    // Extract the JWT from the cookie
                    return req.cookies?.refreshToken; // Ensure that the cookie name matches what you set
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: coreConfig.refreshTokenSecret,
        });
    }

    async validate(payload: UserJwtPayloadDto) {
        await this.usersRepository.findUserAuth(payload.userId);

        const device = await this.securityDevicesRepository.findSessionByDeviceId(payload.deviceId);

        if (!device) {
            console.log('возможно тут логоут и скидывает!');
            throw UnauthorizedDomainException.create();
        }

        const unixTimestamp = Math.floor(device.issuedAt.getTime() / 1000);

        if (unixTimestamp !== payload.iat) {
            console.log('сессия истекла');
            throw UnauthorizedDomainException.create();
        }

        return payload;
    }
}
