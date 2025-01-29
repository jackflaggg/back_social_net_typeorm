//сюда прилетают Все ошибки
import { Catch, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from './domain-exceptions-filter';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
    onCatch(exception: any, response: any, request: any): void {
        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        //TODO: Replace with getter from configService. will be in the following lessons
        const isProduction = process.env.NODE_ENV === 'production';

        if (isProduction && status === HttpStatus.INTERNAL_SERVER_ERROR) {
            response.status(status).json({
                ...this.getDefaultHttpBody(request.url, exception),
                path: null,
                message: 'Some error occurred',
            });

            return;
        }

        response.status(status).send(this.getDefaultHttpBody(request.url, exception));
    }
}
