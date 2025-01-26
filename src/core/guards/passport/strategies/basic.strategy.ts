import { BasicStrategy as Strategy } from 'passport-http';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UnauthorizedDomainException } from '../../../exceptions/incubator-exceptions/domain-exceptions';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy, 'basic-admin') {
    async validate(username: string, password: string) {
        if ('admin' === username && 'qwerty' === password) {
            return true;
        }
        throw UnauthorizedDomainException.create();
    }
}
