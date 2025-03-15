import { BasicStrategy as Strategy } from 'passport-http';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UnauthorizedDomainException } from '../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { AppConfig } from '../../../core/config/app.config';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy, 'basic-admin') {
    constructor(private readonly coreConfig: AppConfig) {
        super();
    }
    async validate(username: string, password: string) {
        const adminName = this.coreConfig.adminUsername;
        const adminPassword = this.coreConfig.adminPassword;
        if (adminName === username && adminPassword === password) {
            return true;
        }
        throw UnauthorizedDomainException.create();
    }
}
