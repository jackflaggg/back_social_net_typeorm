import { BasicStrategy as Strategy } from 'passport-http';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UnauthorizedDomainException } from '../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy, 'basic-admin') {
    constructor(private readonly configService: ConfigService) {
        super();
    }
    async validate(username: string, password: string) {
        const adminName = this.configService.get('ADMIN_USERNAME').trim();
        const adminPassword = this.configService.get('ADMIN_PASSWORD').trim();
        if (adminName === username && adminPassword === password) {
            return true;
        }
        throw UnauthorizedDomainException.create();
    }
}
