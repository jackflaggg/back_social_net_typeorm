import { INestApplication } from '@nestjs/common';
import { LoggingInterceptor } from '../core/interceptors/logger.interceptor';

export function interceptorSetup(app: INestApplication) {
    app.useGlobalInterceptors(new LoggingInterceptor());
}
