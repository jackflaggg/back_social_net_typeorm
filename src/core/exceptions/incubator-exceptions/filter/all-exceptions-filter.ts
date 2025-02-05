//сюда прилетают Все ошибки
import { Catch, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from './domain-exceptions-filter';
import { CoreConfig } from '../../../config/core.config';
import { LoggerService } from '../../../../features/logger/application/logger.service';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
    constructor(
        private readonly coreConfig: CoreConfig,
        private readonly logger: LoggerService,
    ) {
        super();
        this.logger.setContext(AllExceptionsFilter.name);
    }
    onCatch(exception: any, response: any, request: any): void {
        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        const isProduction = this.coreConfig.env === 'production';

        this.logger.log(`Error occurred: ${exception.message || exception}`); // Логируем сообщение об ошибке

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
