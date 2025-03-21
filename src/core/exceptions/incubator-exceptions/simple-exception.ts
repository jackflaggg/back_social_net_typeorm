import { ArgumentsHost, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

export class SimpleExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus() ?? HttpStatus.INTERNAL_SERVER_ERROR;

        const getField = (str: string) => {
            return str.split(' ')[0];
        };
        if (status === HttpStatus.BAD_REQUEST) {
            const errors: any[] = [];

            const responseBody: any = exception.getResponse();

            responseBody.message.forEach((element: any) => {
                errors.push({ message: element.message, field: getField(element) });
            });

            response.status(status).json({
                statusCode: status,
                path: request.url,
                message: (exception as any).message || 'Сервер упал',
                errors: errors,
            });
        }
        response.status(status).json({
            statusCode: status,
            path: request.url,
            message: (exception as any).message || 'Сервер упал',
        });
    }
}
