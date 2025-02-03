//сюда прилетают Все ошибки
import { Catch, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from './domain-exceptions-filter';
import { CoreConfig } from '../../../config/core.config';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
    constructor(private readonly coreConfig: CoreConfig) {
        super();
    }
    onCatch(exception: any, response: any, request: any): void {
        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        //TODO: Replace with getter from configService. will be in the following lessons
        const isProduction = this.coreConfig.env === 'production';

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
