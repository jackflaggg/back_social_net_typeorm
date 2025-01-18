//Ошибки класса DomainException (instanceof DomainException)
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { DomainExceptionCode } from '../domain-exception-codes';
import { DomainException, ErrorExtension } from '../domain-exceptions';
export type HttpResponseBody = {
    timestamp: string;
    path: string | null;
    message: string;
    extensions: ErrorExtension[];
    code: DomainExceptionCode | null;
};

export abstract class BaseExceptionFilter implements ExceptionFilter {
    abstract onCatch(exception: any, response: Response, request: Request): void;

    catch(exception: any, host: ArgumentsHost): any {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        this.onCatch(exception, response, request);
    }

    getDefaultHttpBody(url: string, exception: unknown): HttpResponseBody {
        return {
            timestamp: new Date().toISOString(),
            path: url,
            message: (exception as any).message || 'Internal server error',
            code: exception instanceof DomainException ? exception.code : null,
            extensions: exception instanceof DomainException ? exception.extensions : [],
        };
    }
}

@Catch(DomainException)
export class DomainExceptionsFilter extends BaseExceptionFilter {
    onCatch(exception: DomainException, response: any, request: any): void {
        response.status(this.calculateHttpCode(exception)).json(this.getDefaultHttpBody(request.url, exception));
    }

    calculateHttpCode(exception: DomainException) {
        switch (exception.code) {
            case DomainExceptionCode.BadRequest: {
                return HttpStatus.BAD_REQUEST;
            }
            case DomainExceptionCode.Forbidden: {
                return HttpStatus.FORBIDDEN;
            }
            case DomainExceptionCode.NotFound: {
                return HttpStatus.NOT_FOUND;
            }
            case DomainExceptionCode.Unauthorized: {
                return HttpStatus.UNAUTHORIZED;
            }
            default: {
                return HttpStatus.I_AM_A_TEAPOT;
            }
        }
    }
}
