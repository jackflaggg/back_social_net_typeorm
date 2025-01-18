import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { ZodError } from 'zod';

@Catch(ZodError)
export class ZodFilter<T extends ZodError> implements ExceptionFilter {
    catch(exception: T, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        response.status(status).json({
            message: exception.message,
            field: exception.errors,
        });
    }
}
