//Ошибки класса DomainException (instanceof DomainException)
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { DomainExceptionCode } from '../domain-exception-codes';
import { DomainException, ErrorExtension } from '../domain-exceptions';
import { ZodValidationException } from 'nestjs-zod';
export type HttpResponseBody = {
    timestamp: string;
    path: string | null;
    message: string;
    code: string | null;
};
export type ValidationErrorResponse = {
    errorsMessages: ErrorExtension[];
};

export abstract class BaseExceptionFilter implements ExceptionFilter {
    abstract onCatch(exception: any, response: Response, request: Request): void;

    catch(exception: any, host: ArgumentsHost): any {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        this.onCatch(exception, response, request);
    }

    getDefaultHttpBody(url: string, exception: unknown): ValidationErrorResponse | HttpResponseBody | any {
        if (exception instanceof DomainException && Number((exception as any).extensions.length) > 0) {
            return {
                errorsMessages: exception.extensions,
            };
        }

        if (exception instanceof ZodValidationException) {
            return {
                errorsMessages: [
                    {
                        message: (exception as any).response.errors[0].message,
                        field: (exception as any).response.errors[0].path[0],
                    },
                    (exception as any).response.errors[1]
                        ? {
                              message: (exception as any).response.errors[1].message,
                              field: (exception as any).response.errors[1].path[0],
                          }
                        : null,
                    (exception as any).response.errors[2]
                        ? {
                              message: (exception as any).response.errors[2].message,
                              field: (exception as any).response.errors[2].path[0],
                          }
                        : null,
                ].filter(Boolean),
            };
        }

        return {
            timestamp: new Date().getTime().toString(),
            path: url,
            message: (exception as any).message || 'Internal server error',
            code: exception instanceof DomainException ? exception.code.toString() : null,
        };
    }
}

@Catch(DomainException)
export class DomainExceptionsFilter extends BaseExceptionFilter {
    onCatch(exception: DomainException, response: any, request: any): void {
        response.status(this.calculateHttpCode(exception)).send(this.getDefaultHttpBody(request.url, exception));
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
