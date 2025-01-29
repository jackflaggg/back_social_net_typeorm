import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { ZodError } from 'zod';

@Catch(ZodError)
export class ZodFilter<T extends ZodError> implements ExceptionFilter {
    catch(exception: T, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = HttpStatus.BAD_REQUEST;

        response.status(status).send({
            errorsMessages: [
                {
                    message: exception.errors,
                    field: exception.message,
                },
            ],
        });
    }
}
