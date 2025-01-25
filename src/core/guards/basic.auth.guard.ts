import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { fromUTF8ToBase64 } from '../utils/common/fromUtf8ToBase64';
import { UnauthorizedDomainException } from '../exceptions/incubator-exceptions/domain-exceptions';

@Injectable()
export class BasicAuthGuard implements CanActivate {
    private readonly date = 'admin:qwerty';
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest<Request>();

        const authHeader = request.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Basic')) {
            // default error code 403
            throw UnauthorizedDomainException.create();
        }

        const coded = fromUTF8ToBase64(this.date).toString();
        if (authHeader.slice(6) !== coded) {
            throw UnauthorizedDomainException.create();
        }

        return true;
    }
}
